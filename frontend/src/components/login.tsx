import { useState, type FormEvent } from 'react';
import { AuthLayout } from './AuthShared';
import { signInDemoAccount } from '../data/demoStore';

export function LoginPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const formData = new FormData(form);
    try {
      const account = signInDemoAccount(String(formData.get('email') ?? '').trim());
      window.location.assign(account.role === 'tenant' ? '/tenant/dashboard' : `/${account.role}/dashboard`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not open this demo account in the browser.');
    }
  };

  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered">
          <div className="auth-card-heading">
            <p className="eyebrow">Browser-only demo access</p>
            <h1>Welcome back</h1>
            <p>Continue to a demo profile saved in this browser. This does not verify your identity.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email">Demo account email <span aria-hidden="true">*</span></label>
              <input id="login-email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="form-alert form-alert-warning" role="note">Demo sign-in uses the saved email only. No password is stored or checked. Do not use this for real accounts or personal data.</div>
            {message && <div className="form-alert form-alert-warning" role="alert">{message}</div>}
            <button className="button button-primary auth-submit" type="submit">Continue to demo account</button>
          </form>
          <p className="auth-switch">New to DwellSafe? <a href="/register">Choose an account type</a>.</p>
        </section>
      </main>
    </AuthLayout>
  );
}
