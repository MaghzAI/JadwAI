import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * مولد مفتاح التشفير من متغير البيئة
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET or NEXTAUTH_SECRET environment variable is required');
  }
  
  // إنشاء مفتاح ثابت من النص السري
  return crypto.scryptSync(secret, 'salt', KEY_LENGTH);
}

/**
 * تشفير النص
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, key);
    cipher.setAAD(Buffer.from('additional-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // دمج IV + Tag + البيانات المشفرة
    return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('فشل في تشفير البيانات');
  }
}

/**
 * فك تشفير النص
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    
    if (!ivHex || !tagHex || !encrypted) {
      throw new Error('تنسيق البيانات المشفرة غير صحيح');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipher(ALGORITHM, key);
    decipher.setAAD(Buffer.from('additional-data'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('فشل في فك تشفير البيانات');
  }
}

/**
 * تشفير البيانات الحساسة للمستخدم
 */
export function encryptSensitiveData(data: any): any {
  if (!data) return data;
  
  const sensitiveFields = ['phone', 'bio', 'location', 'company'];
  const encrypted = { ...data };
  
  for (const field of sensitiveFields) {
    if (encrypted[field] && typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field]);
    }
  }
  
  return encrypted;
}

/**
 * فك تشفير البيانات الحساسة للمستخدم
 */
export function decryptSensitiveData(data: any): any {
  if (!data) return data;
  
  const sensitiveFields = ['phone', 'bio', 'location', 'company'];
  const decrypted = { ...data };
  
  for (const field of sensitiveFields) {
    if (decrypted[field] && typeof decrypted[field] === 'string') {
      try {
        decrypted[field] = decrypt(decrypted[field]);
      } catch (error) {
        // إذا فشل فك التشفير، اتركه كما هو (ربما لم يكن مشفراً)
        console.warn(`فشل في فك تشفير الحقل ${field}:`, error);
      }
    }
  }
  
  return decrypted;
}

/**
 * تشفير كلمة المرور مع salt
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * التحقق من كلمة المرور
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * توليد رمز مميز آمن
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * إنشاء hash آمن للبيانات
 */
export function createHash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * التحقق من hash البيانات
 */
export function verifyHash(data: string, hash: string): boolean {
  const dataHash = createHash(data);
  return crypto.timingSafeEqual(Buffer.from(dataHash), Buffer.from(hash));
}

/**
 * تشفير معرف الجلسة
 */
export function encryptSessionId(sessionId: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', key);
  
  let encrypted = cipher.update(sessionId, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * فك تشفير معرف الجلسة
 */
export function decryptSessionId(encryptedSessionId: string): string {
  const key = getEncryptionKey();
  const [ivHex, encrypted] = encryptedSessionId.split(':');
  
  if (!ivHex || !encrypted) {
    throw new Error('تنسيق معرف الجلسة المشفر غير صحيح');
  }
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
