import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

// Schema for settings validation
const settingsSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب'),
  lastName: z.string().min(1, 'الاسم الأخير مطلوب'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  
  // Preferences
  language: z.enum(['ar', 'en']).default('ar'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  currency: z.string().default('SAR'),
  dateFormat: z.string().default('dd/MM/yyyy'),
  timezone: z.string().default('Asia/Riyadh'),
  
  // Notifications
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  projectUpdates: z.boolean().default(true),
  studyAlerts: z.boolean().default(true),
  weeklyReports: z.boolean().default(false),
  
  // Privacy & Security
  profileVisibility: z.enum(['public', 'team', 'private']).default('team'),
  dataSharing: z.boolean().default(false),
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.number().min(0).default(60),
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
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        jobTitle: true,
        company: true,
        location: true,
        bio: true,
        avatar: true,
        preferences: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Parse preferences or use defaults
    const preferences = user.preferences as any || {};
    
    const settings = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      jobTitle: user.jobTitle || '',
      company: user.company || '',
      location: user.location || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      
      language: preferences.language || 'ar',
      theme: preferences.theme || 'system',
      currency: preferences.currency || 'SAR',
      dateFormat: preferences.dateFormat || 'dd/MM/yyyy',
      timezone: preferences.timezone || 'Asia/Riyadh',
      
      emailNotifications: preferences.emailNotifications ?? true,
      pushNotifications: preferences.pushNotifications ?? true,
      projectUpdates: preferences.projectUpdates ?? true,
      studyAlerts: preferences.studyAlerts ?? true,
      weeklyReports: preferences.weeklyReports ?? false,
      
      profileVisibility: preferences.profileVisibility || 'team',
      dataSharing: preferences.dataSharing ?? false,
      twoFactorAuth: preferences.twoFactorAuth ?? false,
      sessionTimeout: preferences.sessionTimeout || 60,
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

    // Separate user data from preferences
    const {
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      company,
      location,
      bio,
      avatar,
      ...preferences
    } = validatedData;

    // Update user and preferences
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        jobTitle,
        company,
        location,
        bio,
        avatar,
        preferences: preferences as any,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        jobTitle: true,
        company: true,
        location: true,
        bio: true,
        avatar: true,
        preferences: true,
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
