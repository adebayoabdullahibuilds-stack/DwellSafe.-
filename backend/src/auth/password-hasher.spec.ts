import { hashPassword, verifyPassword } from './password-hasher';

describe('password hashing', () => {
  it('stores passwords as salted scrypt hashes and verifies the original password', async () => {
    const firstHash = await hashPassword('a long test password');
    const secondHash = await hashPassword('a long test password');

    expect(firstHash).not.toBe(secondHash);
    expect(await verifyPassword('a long test password', firstHash)).toBe(true);
    expect(await verifyPassword('a different password', firstHash)).toBe(false);
  });

  it('rejects malformed or unsupported password hashes', async () => {
    await expect(verifyPassword('password', 'plain-text')).resolves.toBe(false);
    await expect(verifyPassword('password', 'scrypt$bad$hash')).resolves.toBe(false);
  });
});
