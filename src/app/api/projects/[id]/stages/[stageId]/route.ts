import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StageStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id, stageId } = await params;

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const stage = await prisma.projectStage.findFirst({
      where: {
        id: stageId,
        projectId: id,
      },
      include: {
        milestones: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!stage) {
      return NextResponse.json(
        { error: 'المرحلة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error fetching stage:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب المرحلة' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id, stageId } = await params;

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, startDate, endDate, status, progress } = body;

    const updatedStage = await prisma.projectStage.update({
      where: {
        id: stageId,
      },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status: status as StageStatus,
        progress: progress ? parseInt(progress) : undefined,
      },
      include: {
        milestones: true,
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedStage);
  } catch (error) {
    console.error('Error updating stage:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث المرحلة' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id, stageId } = await params;

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Delete all related tasks and milestones first
    await prisma.task.deleteMany({
      where: { stageId },
    });

    await prisma.milestone.deleteMany({
      where: { stageId },
    });

    // Delete the stage
    await prisma.projectStage.delete({
      where: { id: stageId },
    });

    return NextResponse.json(
      { message: 'تم حذف المرحلة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting stage:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف المرحلة' },
      { status: 500 }
    );
  }
}
