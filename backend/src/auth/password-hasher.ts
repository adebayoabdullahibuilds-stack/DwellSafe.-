import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const saltLength = 16;
const keyLength = 64;

function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(saltLength);
  const key = await deriveKey(password, salt);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password: string, encodedHash: string) {
  const [algorithm, saltHex, keyHex] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !keyHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expectedKey = Buffer.from(keyHex, 'hex');
  if (salt.length !== saltLength || expectedKey.length !== keyLength) return false;

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
}
