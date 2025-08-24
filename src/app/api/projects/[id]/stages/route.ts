import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StageStatus } from '@prisma/client';

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
    const projectId = id;

    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    const stages = await prisma.projectStage.findMany({
      where: {
        projectId: projectId,
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
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error('Error fetching project stages:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب مراحل المشروع' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const projectId = id;

    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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
    const { name, description, startDate, endDate, order } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'اسم المرحلة مطلوب' },
        { status: 400 }
      );
    }

    // Get the next order number if not provided
    let stageOrder = order;
    if (!stageOrder) {
      const lastStage = await prisma.projectStage.findFirst({
        where: { projectId },
        orderBy: { order: 'desc' },
      });
      stageOrder = (lastStage?.order || 0) + 1;
    }

    const stage = await prisma.projectStage.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        order: stageOrder,
        projectId,
        status: StageStatus.PENDING,
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

    return NextResponse.json(stage, { status: 201 });
  } catch (error) {
    console.error('Error creating project stage:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء مرحلة المشروع' },
      { status: 500 }
    );
  }
}
