import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth-middleware';
import { Permission } from '@/lib/permissions';
import { prisma } from '@/lib/db/prisma';
import { UserRole } from '@prisma/client';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').optional(),
  email: z.string().email('بريد إلكتروني غير صحيح').optional(),
  role: z.nativeEnum(UserRole).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, Permission.READ_USER);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            studies: true,
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        studies: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, Permission.UPDATE_USER);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userRole } = authResult;
    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, email: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Only ADMINs can change roles to ADMIN
    if (validatedData.role === UserRole.ADMIN && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'ليس لديك الصلاحية لتعيين دور مدير عام' },
        { status: 403 }
      );
    }

    // Check if email already exists (if email is being updated)
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        company: true,
        location: true,
        bio: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'تم تحديث بيانات المستخدم بنجاح',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطأ في تحديث بيانات المستخدم' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await withAuth(request, Permission.DELETE_USER);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { session, userRole } = authResult;
    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (session.user?.id === userId) {
      return NextResponse.json(
        { error: 'لا يمكنك حذف حسابك الخاص' },
        { status: 400 }
      );
    }

    // Only ADMINs can delete other ADMINs
    if (existingUser.role === UserRole.ADMIN && userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'ليس لديك الصلاحية لحذف مدير عام' },
        { status: 403 }
      );
    }

    // Delete user (this will cascade to related records based on schema)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: 'تم حذف المستخدم بنجاح',
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف المستخدم' },
      { status: 500 }
    );
  }
}
