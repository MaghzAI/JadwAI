import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { Permission, hasPermission } from '@/lib/permissions';

/**
 * Middleware للتحقق من المصادقة والأذونات في API Routes
 */
export async function withAuth(
  request: NextRequest,
  requiredPermissions?: Permission | Permission[],
  options?: {
    requireAll?: boolean; // إذا كان true، يتطلب جميع الأذونات
  }
) {
  try {
    const session = await getServerSession(authOptions);

    // التحقق من وجود جلسة صالحة
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول - مطلوب تسجيل الدخول' },
        { status: 401 }
      );
    }

    // إذا لم تكن هناك أذونات مطلوبة، اسمح بالمرور
    if (!requiredPermissions) {
      return { session, user: session.user };
    }

    const userRole = (session.user as any)?.role as UserRole || UserRole.VIEWER;
    const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    // التحقق من الأذونات
    let hasAccess = false;
    if (options?.requireAll) {
      hasAccess = permissions.every(permission => hasPermission(userRole, permission));
    } else {
      hasAccess = permissions.some(permission => hasPermission(userRole, permission));
    }

    if (!hasAccess) {
      return NextResponse.json(
        { 
          error: 'غير مصرح بالوصول - ليس لديك الصلاحيات اللازمة',
          requiredPermissions: permissions
        },
        { status: 403 }
      );
    }

    return { session, user: session.user, userRole };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'خطأ في التحقق من الصلاحيات' },
      { status: 500 }
    );
  }
}

/**
 * التحقق من ملكية المورد
 */
export async function withResourceAuth(
  request: NextRequest,
  resourceOwnerId: string,
  requiredPermission: Permission
) {
  const authResult = await withAuth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { session, userRole } = authResult;
  const userId = session.user?.id;

  // المدير العام يمكنه الوصول لكل شيء
  if (userRole === UserRole.ADMIN) {
    return authResult;
  }

  // التحقق من الإذن أولاً
  if (!hasPermission(userRole as UserRole, requiredPermission)) {
    return NextResponse.json(
      { error: 'ليس لديك الصلاحيات اللازمة لهذا الإجراء' },
      { status: 403 }
    );
  }

  // إذا كان المستخدم هو صاحب المورد
  if (userId === resourceOwnerId) {
    return authResult;
  }

  // المدراء يمكنهم الوصول للموارد حسب أذوناتهم
  if (userRole === UserRole.MANAGER && hasPermission(userRole, requiredPermission)) {
    return authResult;
  }

  return NextResponse.json(
    { error: 'غير مصرح بالوصول - ليس لديك إذن للوصول لهذا المورد' },
    { status: 403 }
  );
}
