import { useState, type FormEvent, type ReactNode } from 'react';

export type AuthRoute =
  | 'register-landlord'
  | 'register-agent'
  | 'login'
  | 'forgot-password'
  | 'privacy'
  | 'terms';

export type RegistrationRole = 'landlord' | 'agent';

function AuthHeader() {
  return (
    <header className="auth-header">
      <a className="brand" href="/" aria-label="DwellSafe home">
        <img src="/dwellsafe-brand.png" alt="" />
        <span className="brand-name">Dwell<span>Safe</span></span>
      </a>
      <a href="/properties">Explore properties <span aria-hidden="true">→</span></a>
    </header>
  );
}

function AuthFooter() {
  return (
    <footer className="auth-footer">
      <p>Creating an account does not verify a person or property.</p>
      <nav aria-label="Legal and help">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="mailto:support@dwellsafe.ng">Support</a>
      </nav>
    </footer>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <AuthHeader />
      {children}
      <AuthFooter />
    </div>
  );
}

function PasswordField({
  id,
  label,
  autoComplete,
  error,
  validateStrength = false,
  onChange,
  value,
}: {
  id: string;
  label: string;
  autoComplete: string;
  error?: string;
  validateStrength?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input-wrap">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          minLength={validateStrength ? 10 : undefined}
          pattern={validateStrength ? '(?=.*[A-Za-z])(?=.*[0-9]).{10,}' : undefined}
          title={validateStrength ? 'Use at least 10 characters, including a letter and a number.' : undefined}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : validateStrength ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {validateStrength && <span className="field-hint" id={`${id}-hint`}>At least 10 characters, including a letter and a number.</span>}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}

function RegistrationPage({ role }: { role: RegistrationRole }) {
  const isLandlord = role === 'landlord';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage('');
    setPasswordError('');
    setConfirmError('');
    const form = event.currentTarget;
    if (!/(?=.*[A-Za-z])(?=.*[0-9]).{10,}/.test(password)) {
      setPasswordError('Choose a password with at least 10 characters, including a letter and a number.');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError('The passwords do not match.');
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitMessage('Account creation is not connected yet. No account was created and no personal information was submitted. Please try again once secure authentication is configured.');
  };

  return (
    <AuthLayout>
      <main className="auth-main registration-main">
        <section className="auth-intro">
          <p className="eyebrow">{isLandlord ? 'For property owners' : 'For property professionals'}</p>
          <h1>{isLandlord ? 'Create your landlord account' : 'Join DwellSafe as an agent'}</h1>
          <p>{isLandlord
            ? 'Prepare a clear, accountable profile before you share property details with prospective renters.'
            : 'Introduce your business and operating areas so renters can understand who represents a property.'}</p>
          <ul className="auth-benefits">
            <li><span aria-hidden="true">✓</span> Keep account details separate from verification checks</li>
            <li><span aria-hidden="true">✓</span> Know what information will be needed next</li>
            <li><span aria-hidden="true">✓</span> No identity documents collected in this demo</li>
          </ul>
          <div className="account-notice">
            <strong>Registration is not verification</strong>
            <p>A new account will not be marked as verified. Identity, professional, property, and authorization checks are distinct steps.</p>
          </div>
        </section>

        <section className="auth-card" aria-labelledby="registration-form-title">
          <div className="auth-card-heading">
            <p className="eyebrow">Create an account</p>
            <h2 id="registration-form-title">Your {role} details</h2>
            <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="full-name">Full name <span aria-hidden="true">*</span></label>
              <input id="full-name" name="name" autoComplete="name" required minLength={2} />
            </div>
            <div className="auth-field">
              <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
              <input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label htmlFor="phone">Phone number <span aria-hidden="true">*</span></label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required />
            </div>

            {isLandlord ? (
              <div className="auth-field">
                <label htmlFor="contact-method">Preferred contact method</label>
                <select id="contact-method" name="contactMethod" defaultValue="email">
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            ) : (
              <>
                <div className="auth-field">
                  <label htmlFor="agency-name">Agency name <span className="optional-label">Optional</span></label>
                  <input id="agency-name" name="agencyName" autoComplete="organization" />
                </div>
                <div className="auth-field">
                  <label htmlFor="operation-areas">Primary areas of operation <span aria-hidden="true">*</span></label>
                  <input id="operation-areas" name="operationAreas" placeholder="e.g. Yaba, Ikeja, Lekki" required />
                  <span className="field-hint">Separate multiple locations with commas.</span>
                </div>
              </>
            )}

            <PasswordField
              id="password"
              label="Password"
              autoComplete="new-password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordError('');
              }}
              error={passwordError}
              validateStrength
            />
            <PasswordField
              id="confirm-password"
              label="Confirm password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setConfirmError('');
              }}
              error={confirmError}
            />

            <label className="consent-field">
              <input type="checkbox" name="termsAccepted" required />
              <span>I agree to the <a href="/terms">Terms of Service</a> and have read the <a href="/privacy">Privacy Notice</a>. <span aria-hidden="true">*</span></span>
            </label>

            {submitMessage && <div className="form-alert form-alert-warning" role="status">{submitMessage}</div>}
            <button className="button button-primary auth-submit" type="submit">Create {role} account</button>
          </form>

          <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
          <p className="auth-switch">{isLandlord ? 'Are you an agent?' : 'Are you a landlord?'} <a href={isLandlord ? '/register/agent' : '/register/landlord'}>Register as {isLandlord ? 'an agent' : 'a landlord'}</a></p>
        </section>

        <section className="next-steps" aria-labelledby="next-steps-title">
          <p className="eyebrow">What happens next</p>
          <h2 id="next-steps-title">A clear process, one step at a time</h2>
          <ol>
            <li><strong>Complete your profile</strong><span>Add the account information needed for your role.</span></li>
            <li><strong>Share property details</strong><span>Provide listing details when secure submission is available.</span></li>
            <li><strong>Provide appropriate evidence</strong><span>Ownership or authorization checks will be explained before evidence is requested.</span></li>
            <li><strong>Wait for checks</strong><span>Account creation alone does not grant a verification status.</span></li>
          </ol>
          {!isLandlord && <p className="next-steps-note">Agents may need to provide identity and professional or property-representation evidence before any applicable verification status is considered.</p>}
        </section>
      </main>
    </AuthLayout>
  );
}

function LoginPage() {
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setMessage('Sign-in is not configured yet. No authentication request was sent and no session was created.');
  };

  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered">
          <div className="auth-card-heading">
            <p className="eyebrow">Landlord & agent access</p>
            <h1>Welcome back</h1>
            <p>Sign-in will be available when secure account services are connected.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email">Email address <span aria-hidden="true">*</span></label>
              <input id="login-email" name="email" type="email" autoComplete="username" required />
            </div>
            <PasswordField id="login-password" label="Password" autoComplete="current-password" value={password} onChange={setPassword} />
            <div className="login-utilities">
              <a href="/forgot-password">Forgot password?</a>
            </div>
            {message && <div className="form-alert form-alert-warning" role="alert">{message}</div>}
            <button className="button button-primary auth-submit" type="submit">Sign in</button>
          </form>
          <p className="auth-switch">New to DwellSafe? <a href="/register/landlord">Create a landlord account</a> or <a href="/register/agent">register as an agent</a>.</p>
          <p className="no-session-note">Remember me is not offered because this demo does not create or manage authenticated sessions.</p>
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

export function ProtectedDashboardPage({ role }: { role: RegistrationRole }) {
  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered protected-notice" aria-labelledby="protected-title">
          <span className="protected-icon" aria-hidden="true">⌑</span>
          <p className="eyebrow">Protected area</p>
          <h1 id="protected-title">{role === 'landlord' ? 'Landlord' : 'Agent'} dashboard</h1>
          <h2>Secure account access is not configured.</h2>
          <p>This route is not accessible without a server-authenticated account and a role returned by the trusted authentication service. No dashboard data is shown.</p>
          <a className="button button-primary auth-submit" href="/login">Go to sign in</a>
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
          ? 'The registration and account forms on this demo do not submit or store the information you enter. Do not enter real personal information until a secure account service and published privacy notice are available.'
          : 'This demo contains fictional sample listings and does not provide real rental offers, account creation, property submissions, or verification services.'}</p>
        <p>For questions, contact <a href="mailto:support@dwellsafe.ng">support@dwellsafe.ng</a>.</p>
        <a className="text-link" href="/">Return to DwellSafe <span aria-hidden="true">→</span></a>
      </main>
    </AuthLayout>
  );
}

export function AuthPage({ route }: { route: AuthRoute }) {
  if (route === 'register-landlord') return <RegistrationPage role="landlord" />;
  if (route === 'register-agent') return <RegistrationPage role="agent" />;
  if (route === 'login') return <LoginPage />;
  if (route === 'forgot-password') return <ForgotPasswordPage />;
  return <LegalInfoPage route={route} />;
}
