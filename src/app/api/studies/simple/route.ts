import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const [studies, total] = await Promise.all([
      prisma.feasibilityStudy.findMany({
        where: { userId: user.id },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              industry: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.feasibilityStudy.count({
        where: { userId: user.id }
      })
    ]);

    return NextResponse.json({
      studies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching studies:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الدراسات: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'عنوان الدراسة مطلوب' },
        { status: 400 }
      );
    }

    if (!body.projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: body.projectId,
        userId: user.id
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'المشروع غير موجود أو ليس لديك صلاحية الوصول' }, { status: 404 });
    }

    // Create the study
    const study = await prisma.feasibilityStudy.create({
      data: {
        title: body.title,
        description: body.description || '',
        type: body.studyType || body.type || 'COMPREHENSIVE',
        language: body.language || 'ar',
        aiModel: body.aiModel || 'gemini',
        projectId: body.projectId,
        userId: user.id
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            industry: true
          }
        }
      }
    });

    console.log('Study created successfully:', study);
    return NextResponse.json(study, { status: 201 });
  } catch (error) {
    console.error('Error creating study:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء الدراسة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}
