/**
 * Minimal early-access authentication gate for the static NET0ZE landing page.
 * Phone OTP runs once during account creation; ordinary sign-in never asks for
 * the phone code again. The browser receives only the public Supabase key.
 */
(() => {
  'use strict';

  const FILE_NAME = 'ThankYou.txt';
  const FALLBACK = 'Thank you for your interest in NET0ZE.\n\nNET0ZE will be available soon.\n';
  const config = window.NET0ZE_AUTH_CONFIG ?? {};
  const dialog = document.querySelector('[data-auth-dialog]');
  const authForm = document.querySelector('[data-auth-form]');
  const signupOtpForm = document.querySelector('[data-signup-otp-form]');
  const authStatus = document.querySelector('[data-auth-status]');
  const authSubmit = document.querySelector('[data-auth-submit]');
  const signout = document.querySelector('[data-auth-signout]');
  const pending = { link: null };
  let mode = 'signin';
  let client = null;
  let user = null;
  let pendingSignup = null;

  const setStatus = (message, tone = '') => {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.dataset.tone = tone;
  };

  const isConfigured = () => Boolean(config.supabaseUrl && config.supabasePublishableKey && window.supabase?.createClient);
  const isVerified = () => Boolean(user?.email_confirmed_at && user?.phone && user?.phone_confirmed_at);

  const setMode = (nextMode) => {
    mode = nextMode;
    document.querySelectorAll('[data-auth-mode]').forEach((tab) => {
      const active = tab.dataset.authMode === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.auth-signup-only').forEach((element) => {
      element.hidden = mode !== 'signup';
    });
    if (authSubmit) authSubmit.textContent = mode === 'signup' ? 'Create account' : 'Sign in';
    if (authForm && !pendingSignup) authForm.reset();
    if (mode === 'signup') setStatus('Create your account once. We will verify the phone during signup, not during later sign-in.');
  };

  const openDialog = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    if (!isConfigured()) {
      setStatus('Authentication is not configured on this deployment yet. Downloads remain locked.', 'error');
      return;
    }
    if (isVerified()) setStatus('Verified access is ready. The temporary ThankYou.txt file is available.');
  };

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  const updateAuthUi = () => {
    const label = isVerified() ? 'Verified access' : user ? 'Confirm email' : 'Sign in';
    document.querySelectorAll('[data-auth-open]').forEach((button) => {
      button.textContent = label;
    });
    if (signout) signout.hidden = !user;
    if (authForm) authForm.hidden = Boolean(pendingSignup);
    if (signupOtpForm) signupOtpForm.hidden = !pendingSignup;
    document.querySelectorAll('.download-gated').forEach((link) => {
      link.setAttribute('aria-disabled', String(!isVerified()));
      link.classList.toggle('is-verified', isVerified());
    });
  };

  const downloadNote = async () => {
    const blob = new Blob([FALLBACK], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = FILE_NAME;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const finishPendingDownload = async () => {
    if (!pending.link || !isVerified()) return;
    pending.link = null;
    closeDialog();
    await downloadNote();
  };

  document.querySelectorAll('[data-auth-open]').forEach((button) => button.addEventListener('click', openDialog));
  document.querySelector('[data-auth-close]')?.addEventListener('click', closeDialog);
  document.querySelectorAll('[data-auth-mode]').forEach((tab) => tab.addEventListener('click', () => setMode(tab.dataset.authMode)));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('#downloads .download-card-ready a[data-download-link]');
    if (!link) return;
    event.preventDefault();
    if (!isVerified()) {
      pending.link = link;
      openDialog();
      setStatus(isConfigured() ? 'Sign in, or create an account with one-time phone verification, to unlock the temporary download.' : 'Authentication is not configured on this deployment yet. Downloads remain locked.', 'error');
      return;
    }
    downloadNote();
  }, true);

  authForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!client) return setStatus('Authentication is not configured on this deployment yet. Downloads remain locked.', 'error');
    const form = new FormData(authForm);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    if (mode === 'signup') {
      const phone = String(form.get('phone') || '').trim();
      if (!form.get('consent')) return setStatus('Please accept the limited verification-data notice before creating an account.', 'error');
      const result = await client.auth.signUp({
        phone,
        password,
        options: { channel: 'sms', data: { signup_email: email } },
      });
      if (result.error) return setStatus(result.error.message, 'error');
      pendingSignup = { email, phone };
      authForm.reset();
      updateAuthUi();
      setStatus('Account started. Enter the SMS code once to finish phone verification.', 'success');
      return;
    }

    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error) return setStatus(result.error.message, 'error');
    user = result.data.user;
    updateAuthUi();
    if (!user?.email_confirmed_at) return setStatus('Confirm your email before downloading. Phone verification is not repeated at sign-in.', 'error');
    if (isVerified()) {
      setStatus('Account verified. Unlocking your temporary download.', 'success');
      return finishPendingDownload();
    }
    setStatus('This account still needs the email confirmation step.', 'error');
  });

  signupOtpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const code = String(new FormData(signupOtpForm).get('code') || '').trim();
    if (!client || !pendingSignup || !code) return setStatus('Enter the SMS code sent to your phone.', 'error');
    const result = await client.auth.verifyOtp({ phone: pendingSignup.phone, token: code, type: 'sms' });
    if (result.error) return setStatus(result.error.message, 'error');
    user = result.data.user;
    const emailResult = await client.auth.updateUser({ email: pendingSignup.email });
    if (emailResult.error) return setStatus(emailResult.error.message, 'error');
    pendingSignup = null;
    updateAuthUi();
    setMode('signin');
    setStatus('Phone verified once during signup. Check your email to finish account confirmation, then sign in normally.', 'success');
  });

  signout?.addEventListener('click', async () => {
    await client?.auth.signOut();
    user = null;
    pendingSignup = null;
    updateAuthUi();
    setStatus('Signed out. Downloads are locked again.');
  });

  if (isConfigured()) {
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    client.auth.onAuthStateChange((_event, session) => {
      user = session?.user ?? null;
      updateAuthUi();
      if (isVerified()) finishPendingDownload();
    });
    client.auth.getSession().then(({ data }) => {
      user = data.session?.user ?? null;
      updateAuthUi();
    });
  } else {
    updateAuthUi();
  }
})();
