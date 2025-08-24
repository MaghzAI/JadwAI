import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type') as NotificationType | null;

    const where: any = {
      userId: session.user.id,
    };

    if (isRead !== null) {
      where.isRead = isRead === 'true';
    }

    if (type) {
      where.type = type;
    }

    // Get total count
    const total = await prisma.notification.count({ where });

    // Get notifications with pagination
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount: await prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الإشعارات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, message, type, relatedId, relatedType, userId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'العنوان والرسالة مطلوبان' },
        { status: 400 }
      );
    }

    // Use provided userId or current user's ID
    const targetUserId = userId || session.user.id;

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: (type as NotificationType) || NotificationType.INFO,
        userId: targetUserId,
        relatedId: relatedId || null,
        relatedType: relatedType || null,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء الإشعار' },
      { status: 500 }
    );
  }
}
