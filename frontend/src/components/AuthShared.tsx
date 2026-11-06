import { useState, type ReactNode } from 'react';

export type RegistrationRole = 'tenant' | 'landlord' | 'agent';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <header className="auth-header">
        <a className="brand" href="/" aria-label="DwellSafe home">
          <img src="/dwellsafe-brand.png" alt="" />
          <span className="brand-name">Dwell<span>Safe</span></span>
        </a>
        <a href="/properties">Explore properties <span aria-hidden="true">→</span></a>
      </header>
      {children}
      <footer className="auth-footer">
        <p>Creating an account does not verify a person or property.</p>
        <nav aria-label="Legal and help">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:support@dwellsafe.ng">Support</a>
        </nav>
      </footer>
    </div>
  );
}

export function PasswordField({
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
  const passwordChecks = [
    { label: 'At least 10 characters', passed: value.length >= 10 },
    { label: 'At least one letter', passed: /[A-Za-z]/.test(value) },
    { label: 'At least one number', passed: /\d/.test(value) },
  ];
  const hasVariety = (/[a-z]/.test(value) && /[A-Z]/.test(value)) || /[^A-Za-z0-9]/.test(value);
  const strengthScore = value
    ? passwordChecks.filter((check) => check.passed).length
      + Number(value.length >= 14)
      + Number(hasVariety)
    : 0;
  const strengthLabel = !value
    ? 'Not entered'
    : strengthScore <= 2
      ? 'Weak'
      : strengthScore === 3
        ? 'Fair'
        : strengthScore === 4
          ? 'Good'
          : 'Strong';
  const strengthLevel = !value ? 'empty' : strengthLabel.toLowerCase();

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
          aria-describedby={validateStrength ? `${id}-hint${error ? ` ${errorId}` : ''}` : error ? errorId : undefined}
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
      {validateStrength && (
        <div className="password-guidance" id={`${id}-hint`}>
          <div className="password-strength-heading">
            <span>Password strength</span>
            <span className={`password-strength-label is-${strengthLevel}`}>{strengthLabel}</span>
          </div>
          <div
            className="password-strength-meter"
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={strengthScore}
            aria-valuetext={strengthLabel}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={index < strengthScore ? `is-filled is-${strengthLevel}` : ''}
              />
            ))}
          </div>
          <ul className="password-requirements">
            {passwordChecks.map(({ label: checkLabel, passed }) => (
              <li key={checkLabel} className={passed ? 'is-passed' : ''}>
                <span aria-hidden="true">{passed ? '✓' : '○'}</span>
                {checkLabel}
              </li>
            ))}
            <li className={value.length >= 14 ? 'is-passed' : ''}>
              <span aria-hidden="true">{value.length >= 14 ? '✓' : '○'}</span>
              14+ characters for extra strength
            </li>
            <li className={hasVariety ? 'is-passed' : ''}>
              <span aria-hidden="true">{hasVariety ? '✓' : '○'}</span>
              Mix uppercase/lowercase or add a symbol
            </li>
          </ul>
        </div>
      )}
      {error && <span className="field-error" id={errorId}>{error}</span>}
    </div>
  );
}
