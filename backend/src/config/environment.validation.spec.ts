import { validateEnvironment } from './environment.validation';

const databaseUrl = 'postgresql://user:pass@localhost:5432/dwellsafe';

describe('environment validation', () => {
  it('requires HTTPS frontend origins in production', () => {
    expect(() => validateEnvironment({
      NODE_ENV: 'production',
      DATABASE_URL: databaseUrl,
      FRONTEND_ORIGINS: 'http://dwellsafe.example',
    })).toThrow('FRONTEND_ORIGINS must contain valid HTTPS production origins.');
  });

  it('accepts HTTPS frontend origins in production', () => {
    expect(validateEnvironment({
      NODE_ENV: 'production',
      DATABASE_URL: databaseUrl,
      FRONTEND_ORIGINS: 'https://dwellsafe.example',
    }).FRONTEND_ORIGINS).toEqual(['https://dwellsafe.example']);
  });
});
