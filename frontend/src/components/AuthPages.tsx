import { useState, type FormEvent } from 'react';
import { AuthLayout } from './AuthShared';
import { LoginPage } from './login';
import { RegisterPage } from './register';

export type AuthRoute =
  | 'choose-role'
  | 'register-tenant'
  | 'register-landlord'
  | 'register-agent'
  | 'login'
  | 'forgot-password'
  | 'privacy'
  | 'terms';

function ChooseRolePage() {
  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered" aria-labelledby="role-choice-title">
          <div className="auth-card-heading">
            <p className="eyebrow">Get started with DwellSafe</p>
            <h1 id="role-choice-title">How will you use DwellSafe?</h1>
            <p>Choose the account type that best describes you.</p>
          </div>
          <div className="auth-form">
            <a className="button button-primary auth-submit" href="/register/tenant">I’m looking for a home</a>
            <a className="button button-outline auth-submit" href="/register/landlord">I’m a landlord</a>
          </div>
          <p className="auth-switch">Are you an agent? <a href="/register/agent">Register as an agent</a></p>
          <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
        </section>
      </main>
    </AuthLayout>
  );
}

function ForgotPasswordPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setMessage('Password recovery is not configured yet. No email was sent and no account status was changed.');
  };

  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered">
          <div className="auth-card-heading">
            <p className="eyebrow">Account help</p>
            <h1>Reset your password</h1>
            <p>Enter your account email. We will only send a recovery email once a secure authentication provider is connected.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="recovery-email">Email address <span aria-hidden="true">*</span></label>
              <input id="recovery-email" name="email" type="email" autoComplete="email" required />
            </div>
            {message && <div className="form-alert form-alert-warning" role="status">{message}</div>}
            <button className="button button-primary auth-submit" type="submit">Request password reset</button>
          </form>
          <p className="auth-switch"><a href="/login">Return to sign in</a></p>
        </section>
      </main>
    </AuthLayout>
  );
}

function LegalInfoPage({ route }: { route: 'privacy' | 'terms' }) {
  const isPrivacy = route === 'privacy';
  return (
    <AuthLayout>
      <main className="legal-page">
        <p className="eyebrow">DwellSafe information</p>
        <h1>{isPrivacy ? 'Privacy notice' : 'Terms of service'}</h1>
        <div className="form-alert form-alert-warning" role="status">This product is an early demo. A complete legal policy has not been published yet.</div>
        <p>{isPrivacy
          ? 'This prototype stores demo account profiles, apartment details, requests, agent relationships, rating scores, and identity document categories in your browser local storage. Selected identity files are not uploaded or saved, and ID numbers are not collected. Passwords are not stored, and the email-only demo sign-in does not verify identity. Do not enter real personal information or select real identity documents. Clearing browser storage removes demo data.'
          : 'This demo contains fictional sample listings and browser-only demo accounts and apartment records. It does not provide secure authentication, real rental offers, or verification services.'}</p>
        <p>For questions, contact <a href="mailto:support@dwellsafe.ng">support@dwellsafe.ng</a>.</p>
        <a className="text-link" href="/">Return to DwellSafe <span aria-hidden="true">→</span></a>
      </main>
    </AuthLayout>
  );
}

export function AuthPage({ route }: { route: AuthRoute }) {
  if (route === 'choose-role') return <ChooseRolePage />;
  if (route === 'register-tenant') return <RegisterPage role="tenant" />;
  if (route === 'register-landlord') return <RegisterPage role="landlord" />;
  if (route === 'register-agent') return <RegisterPage role="agent" />;
  if (route === 'login') return <LoginPage />;
  if (route === 'forgot-password') return <ForgotPasswordPage />;
  return <LegalInfoPage route={route} />;
}
