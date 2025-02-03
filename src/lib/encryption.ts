import crypto from 'crypto';

// Constants for encryption
const SALT_BYTES = 32;
const IV_BYTES = 16;
const KEY_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const ALGORITHM = 'aes-256-gcm';

interface EncryptionResult {
  encryptedText: string;
  salt: string;
  iv: string;
  authTag: string;
}

export function generateKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, KEY_ITERATIONS, KEY_LENGTH, 'sha256');
}

export function encrypt(text: string, password: string): EncryptionResult {
  const salt = crypto.randomBytes(SALT_BYTES);
  const iv = crypto.randomBytes(IV_BYTES);
  const key = generateKey(password, salt);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    encryptedText: encrypted,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

export function decrypt(
  encryptedText: string,
  password: string,
  salt: string,
  iv: string,
  authTag: string
): string {
  try {
    const key = generateKey(password, Buffer.from(salt, 'hex'));
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch {
    throw new Error('Decryption failed. Invalid password or corrupted data.');
  }
}

// Generate a secure random password
export function generateSecurePassword(): string {
  // Generate random bytes and convert to base64
  const base64 = crypto.randomBytes(32).toString('base64');
  // Make it URL safe by replacing non-URL safe characters
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Hash a password for verification
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify a password against its hash
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
} 