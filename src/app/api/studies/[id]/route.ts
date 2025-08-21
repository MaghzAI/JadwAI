import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const studyId = id;
    
    if (!studyId) {
      return NextResponse.json(
        { error: 'معرف الدراسة غير صحيح' },
        { status: 400 }
      );
    }

    const study = await prisma.feasibilityStudy.findFirst({
      where: {
        id: studyId,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: true,
      },
    });

    if (!study) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(study);
  } catch (error) {
    console.error('Error fetching study:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الدراسة' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const studyId = id;
    
    if (!studyId) {
      return NextResponse.json(
        { error: 'معرف الدراسة غير صحيح' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Check if study exists and belongs to user
    const existingStudy = await prisma.feasibilityStudy.findFirst({
      where: {
        id: studyId,
        project: {
          userId: session.user.id,
        },
      },
    });

    if (!existingStudy) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة' },
        { status: 404 }
      );
    }

    // Update study
    const updatedStudy = await prisma.feasibilityStudy.update({
      where: {
        id: studyId,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(updatedStudy);
  } catch (error) {
    console.error('Error updating study:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث الدراسة' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const studyId = id;
    
    if (!studyId) {
      return NextResponse.json(
        { error: 'معرف الدراسة غير صحيح' },
        { status: 400 }
      );
    }

    // Check if study exists and belongs to user
    const existingStudy = await prisma.feasibilityStudy.findFirst({
      where: {
        id: studyId,
        project: {
          userId: session.user.id,
        },
      },
    });

    if (!existingStudy) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة' },
        { status: 404 }
      );
    }

    // Delete the study
    await prisma.feasibilityStudy.delete({
      where: {
        id: studyId,
      },
    });

    return NextResponse.json(
      { message: 'تم حذف الدراسة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting study:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف الدراسة' },
      { status: 500 }
    );
  }
}
