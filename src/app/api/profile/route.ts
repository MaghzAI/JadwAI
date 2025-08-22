import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { encryptSensitiveData, decryptSensitiveData } from '@/lib/crypto';
import { withRateLimit, apiRateLimit } from '@/lib/middleware/rate-limit';
import { withCSRFProtection } from '@/lib/middleware/csrf';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // فك تشفير البيانات الحساسة قبل إرسالها للعميل
    const decryptedUser = decryptSensitiveData(user);

    return NextResponse.json(decryptedUser);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب بيانات الملف الشخصي' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // تطبيق Rate Limiting
    const rateLimitResult = await withRateLimit(request, apiRateLimit);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // تطبيق CSRF Protection
    const csrfResult = await withCSRFProtection(request);
    if (csrfResult) {
      return csrfResult;
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { firstName, lastName, phone, company, location, bio } = body;

    // Basic validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: 'الاسم الأول مطلوب' },
        { status: 400 }
      );
    }
    
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        { error: 'الاسم الأخير مطلوب' },
        { status: 400 }
      );
    }

    // Validate phone number format if provided
    if (phone && !/^[+]?[\d\s\-()]+$/.test(phone)) {
      return NextResponse.json(
        { error: 'تنسيق رقم الهاتف غير صحيح' },
        { status: 400 }
      );
    }

    // تشفير البيانات الحساسة قبل الحفظ
    const validatedData = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      location: location?.trim() || null,
      bio: bio?.trim() || null,
    };
    const encryptedData = encryptSensitiveData(validatedData);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: encryptedData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // فك تشفير البيانات قبل إرسالها للعميل
    const decryptedUser = decryptSensitiveData(updatedUser);

    return NextResponse.json({
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: decryptedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث الملف الشخصي' },
      { status: 500 }
    );
  }
}
