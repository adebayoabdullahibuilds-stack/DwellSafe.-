import { useState, type FormEvent } from 'react';
import { AuthLayout, PasswordField, type RegistrationRole } from './AuthShared';
import { createDemoAccount } from '../data/demoStore';

export function RegisterPage({ role }: { role: RegistrationRole }) {
  const isLandlord = role === 'landlord';
  const isAgent = role === 'agent';
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

    const formData = new FormData(form);
    try {
      createDemoAccount({
        role,
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        phone: String(formData.get('phone') ?? '').trim(),
      });
      window.location.assign(role === 'tenant' ? '/tenant/dashboard' : `/${role}/dashboard`);
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Could not save the demo account in this browser.');
    }
  };

  return (
    <AuthLayout>
      <main className="auth-main registration-main">
        <section className="auth-intro">
          <p className="eyebrow">{isLandlord ? 'For property owners' : isAgent ? 'For property professionals' : 'For home seekers'}</p>
          <h1>{isLandlord ? 'Create your landlord account' : isAgent ? 'Join DwellSafe as an agent' : 'Create your tenant account'}</h1>
          <p>{isLandlord
            ? 'Prepare a clear, accountable profile before you share property details with prospective renters.'
            : isAgent
              ? 'Introduce your business and operating areas so renters can understand who represents a property.'
              : 'Create a profile to make it easier to find and keep track of homes that fit your needs.'}</p>
          <ul className="auth-benefits">
            <li><span aria-hidden="true">✓</span> Demo profile is saved only in this browser</li>
            <li><span aria-hidden="true">✓</span> Passwords are never saved by this demo</li>
            <li><span aria-hidden="true">✓</span> Do not enter real personal information</li>
          </ul>
          <div className="account-notice">
            <strong>Browser-only demo account</strong>
            <p>This prototype does not provide secure authentication. Profile and property data are stored on this device only; do not use real personal information.</p>
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
            ) : isAgent ? (
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
            ) : null}

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

            {submitMessage && <div className="form-alert form-alert-warning" role="alert">{submitMessage}</div>}
            <button className="button button-primary auth-submit" type="submit">Create {role} account</button>
          </form>

          <p className="auth-switch">Already have an account? <a href="/login">Sign in</a></p>
          <p className="auth-switch">
            {role === 'tenant'
              ? <>Are you a landlord or agent? <a href="/register">Choose another account type</a></>
              : <>Are you {isLandlord ? 'an agent' : 'a landlord'}? <a href={isLandlord ? '/register/agent' : '/register/landlord'}>Register as {isLandlord ? 'an agent' : 'a landlord'}</a></>}
          </p>
        </section>

        <section className="next-steps" aria-labelledby="next-steps-title">
          <p className="eyebrow">What happens next</p>
          <h2 id="next-steps-title">{role === 'tenant' ? 'Start your home search with confidence' : 'A clear process, one step at a time'}</h2>
          <ol>
            {role === 'tenant' ? (
              <>
                <li><strong>Complete your profile</strong><span>Set up the details needed for your account.</span></li>
                <li><strong>Explore available homes</strong><span>Browse listings and compare property details.</span></li>
                <li><strong>Review listing information</strong><span>Check the available details before contacting a representative.</span></li>
                <li><strong>Stay alert</strong><span>DwellSafe does not guarantee a listing or replace your own checks.</span></li>
              </>
            ) : (
              <>
                <li><strong>Complete your profile</strong><span>Add the account information needed for your role.</span></li>
                <li><strong>Share property details</strong><span>Provide listing details when secure submission is available.</span></li>
                <li><strong>Provide appropriate evidence</strong><span>Ownership or authorization checks will be explained before evidence is requested.</span></li>
                <li><strong>Wait for checks</strong><span>Account creation alone does not grant a verification status.</span></li>
              </>
            )}
          </ol>
          {isAgent && <p className="next-steps-note">Agents may need to provide identity and professional or property-representation evidence before any applicable verification status is considered.</p>}
        </section>
      </main>
    </AuthLayout>
  );
}
