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
    const projectId = id;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        studies: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب المشروع' },
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
    const projectId = id;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...body,
        initialInvestment: body.initialInvestment ? parseFloat(body.initialInvestment) : undefined,
        expectedRevenue: body.expectedRevenue ? parseFloat(body.expectedRevenue) : undefined,
        projectDuration: body.projectDuration ? parseInt(body.projectDuration) : undefined,
        teamSize: body.teamSize ? parseInt(body.teamSize) : undefined,
        updatedAt: new Date(),
      },
      include: {
        studies: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث المشروع' },
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
    const projectId = id;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Delete all related feasibility studies first
    await prisma.feasibilityStudy.deleteMany({
      where: {
        projectId: projectId,
      },
    });

    // Delete the project
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json(
      { message: 'تم حذف المشروع بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف المشروع' },
      { status: 500 }
    );
  }
}
