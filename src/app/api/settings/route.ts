import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for settings validation
const settingsSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  language: z.enum(['ar', 'en']).default('ar'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        image: true,
        language: true,
        theme: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const settings = {
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      location: user.location || '',
      bio: user.bio || '',
      image: user.image || '',
      language: user.language || 'ar',
      theme: user.theme || 'system',
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الإعدادات' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        image: true,
        language: true,
        theme: true,
      }
    });

    return NextResponse.json({
      message: 'تم حفظ الإعدادات بنجاح',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user settings:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطأ في حفظ الإعدادات' },
      { status: 500 }
    );
  }
}
