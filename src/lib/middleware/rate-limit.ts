import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number; // نافذة زمنية بالمللي ثانية
  maxRequests: number; // عدد الطلبات المسموح بها
  message?: string; // رسالة خطأ مخصصة
}

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// إنشاء ذاكرة تخزين مؤقت للطلبات
const cache = new LRUCache<string, RateLimitInfo>({
  max: 500, // الحد الأقصى لعدد العناصر المحفوظة
  ttl: 1000 * 60 * 60, // ساعة واحدة
});

/**
 * الحصول على معرف العميل من الطلب
 */
function getClientId(request: NextRequest): string {
  // استخدام IP كمعرف أساسي
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
    request.headers.get('x-real-ip') || 
    '127.0.0.1';
  
  // إضافة User-Agent للتمييز بين العملاء
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent.slice(0, 50)}`; // تقييد طول User-Agent
}

/**
 * تطبيق Rate Limiting
 */
export function rateLimit(options: RateLimitOptions) {
  return (request: NextRequest) => {
    const clientId = getClientId(request);
    const now = Date.now();
    const key = `${clientId}:${Math.floor(now / options.interval)}`;
    
    // الحصول على المعلومات الحالية
    let rateLimitInfo = cache.get(key);
    
    if (!rateLimitInfo) {
      // إنشاء سجل جديد
      rateLimitInfo = {
        count: 0,
        resetTime: now + options.interval,
      };
    }
    
    // زيادة العداد
    rateLimitInfo.count += 1;
    
    // حفظ التحديث
    cache.set(key, rateLimitInfo);
    
    // التحقق من تجاوز الحد المسموح
    if (rateLimitInfo.count > options.maxRequests) {
      return NextResponse.json(
        { 
          error: options.message || 'تم تجاوز الحد المسموح من الطلبات',
          retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimitInfo.resetTime / 1000).toString(),
            'Retry-After': Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
          }
        }
      );
    }
    
    // إرجاع null يعني السماح بالطلب
    return null;
  };
}

// تكوينات Rate Limiting مختلفة
export const authRateLimit = rateLimit({
  interval: 15 * 60 * 1000, // 15 دقيقة
  maxRequests: 5, // 5 محاولات تسجيل دخول
  message: 'تم تجاوز حد محاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة'
});

export const apiRateLimit = rateLimit({
  interval: 60 * 1000, // دقيقة واحدة
  maxRequests: 100, // 100 طلب في الدقيقة
  message: 'تم تجاوز حد الطلبات. يرجى المحاولة بعد دقيقة'
});

export const strictRateLimit = rateLimit({
  interval: 60 * 1000, // دقيقة واحدة
  maxRequests: 10, // 10 طلبات في الدقيقة
  message: 'تم تجاوز حد الطلبات للعمليات الحساسة'
});

export const uploadRateLimit = rateLimit({
  interval: 5 * 60 * 1000, // 5 دقائق
  maxRequests: 20, // 20 رفع ملف في 5 دقائق
  message: 'تم تجاوز حد رفع الملفات. يرجى المحاولة بعد 5 دقائق'
});

/**
 * مساعد لتطبيق Rate Limiting في Route Handlers
 */
export async function withRateLimit(
  request: NextRequest,
  limiter: ReturnType<typeof rateLimit>
): Promise<NextResponse | null> {
  const result = limiter(request);
  return result;
}

/**
 * تنظيف الذاكرة المؤقتة (يمكن استدعاؤها دورياً)
 */
export function cleanupRateLimit() {
  cache.clear();
}

/**
 * الحصول على إحصائيات Rate Limiting
 */
export function getRateLimitStats() {
  return {
    size: cache.size,
    maxSize: cache.max,
    calculatedSize: cache.calculatedSize,
  };
}
