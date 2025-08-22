import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'default-csrf-secret';

/**
 * توليد رمز CSRF جديد
 */
export function generateCSRFToken(sessionId?: string): string {
  const randomToken = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const sessionSeed = sessionId || 'anonymous';
  
  // دمج الرمز العشوائي مع معرف الجلسة
  const combined = `${randomToken}:${sessionSeed}:${CSRF_SECRET}`;
  return createHash('sha256').update(combined).digest('hex');
}

/**
 * التحقق من صحة رمز CSRF
 */
export function verifyCSRFToken(token: string, sessionId?: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  try {
    const sessionSeed = sessionId || 'anonymous';
    
    // التحقق من أن الرمز تم توليده بنفس الطريقة
    const parts = token.split(':');
    if (parts.length !== 1) return false;
    
    // إعادة إنشاء الرمز للمقارنة
    const expectedTokens = [];
    
    // جرب عدة احتمالات للرمز العشوائي (في حالة تم توليد عدة رموز)
    for (let i = 0; i < 100; i++) {
      const testRandom = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
      const combined = `${testRandom}:${sessionSeed}:${CSRF_SECRET}`;
      const expectedToken = createHash('sha256').update(combined).digest('hex');
      
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}

/**
 * استخراج رمز CSRF من الطلب
 */
export function extractCSRFToken(request: NextRequest): string | null {
  // البحث في الرؤوس أولاً
  const headerToken = request.headers.get('x-csrf-token') || 
                     request.headers.get('csrf-token');
  
  if (headerToken) {
    return headerToken;
  }

  // البحث في الكوكيز
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * إضافة رمز CSRF للاستجابة
 */
export function addCSRFTokenToResponse(
  response: NextResponse, 
  token: string,
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  }
): NextResponse {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'strict'
  } = options || {};

  response.cookies.set('csrf-token', token, {
    httpOnly,
    secure,
    sameSite,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 ساعة
  });

  // إضافة الرمز في الرأس أيضاً للوصول من JavaScript
  response.headers.set('X-CSRF-Token', token);

  return response;
}

/**
 * Middleware للحماية من CSRF
 */
export async function withCSRFProtection(
  request: NextRequest,
  options?: {
    skipForGET?: boolean;
    skipForMethods?: string[];
  }
): Promise<NextResponse | null> {
  const { skipForGET = true, skipForMethods = [] } = options || {};
  
  const method = request.method;
  
  // تخطي GET requests افتراضياً
  if (skipForGET && method === 'GET') {
    return null;
  }
  
  // تخطي الطرق المحددة
  if (skipForMethods.includes(method)) {
    return null;
  }
  
  // طرق تتطلب حماية CSRF
  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  
  if (!protectedMethods.includes(method)) {
    return null;
  }

  try {
    const session = await getServerSession(authOptions);
    const sessionId = session?.user?.id;
    
    // استخراج رمز CSRF من الطلب
    const submittedToken = extractCSRFToken(request);
    
    if (!submittedToken) {
      return NextResponse.json(
        { 
          error: 'مطلوب رمز CSRF',
          code: 'CSRF_TOKEN_MISSING'
        },
        { status: 403 }
      );
    }

    // التحقق من صحة الرمز
    const isValidToken = verifyCSRFToken(submittedToken, sessionId);
    
    if (!isValidToken) {
      return NextResponse.json(
        { 
          error: 'رمز CSRF غير صحيح أو منتهي الصلاحية',
          code: 'CSRF_TOKEN_INVALID'
        },
        { status: 403 }
      );
    }

    // الرمز صحيح - السماح بالطلب
    return null;

  } catch (error) {
    console.error('CSRF protection error:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في التحقق من الحماية',
        code: 'CSRF_VERIFICATION_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * إنشاء endpoint لتوليد رموز CSRF
 */
export async function generateCSRFEndpoint(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = session?.user?.id;
    
    const token = generateCSRFToken(sessionId);
    
    const response = NextResponse.json({
      token,
      message: 'تم توليد رمز CSRF بنجاح'
    });

    return addCSRFTokenToResponse(response, token);

  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { error: 'فشل في توليد رمز CSRF' },
      { status: 500 }
    );
  }
}

/**
 * مساعد للحصول على رمز CSRF من الكوكيز في العميل
 */
export function getCSRFTokenFromCookies(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf-token') {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}
