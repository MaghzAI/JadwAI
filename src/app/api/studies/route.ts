import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withResourceAuth } from '@/lib/middleware/auth-middleware';
import { Permission } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { StudyStatus, StudyType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const authResult = await withAuth(request, Permission.READ_STUDY);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { session } = authResult;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as StudyStatus | 'all';
    const type = searchParams.get('type') as StudyType | 'all';
    const projectId = searchParams.get('projectId');

    // Build where clause
    const where: any = {
      project: {
        userId: session.user.id,
      },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    // Get total count
    const total = await prisma.feasibilityStudy.count({ where });

    // Get studies with pagination
    const studies = await prisma.feasibilityStudy.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      studies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching studies:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الدراسات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await withAuth(request, Permission.CREATE_STUDY);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { session } = authResult;

    const body = await request.json();
    
    // Validate required fields
    const {
      projectId,
      title,
      type,
      language,
      aiModel,
      includeFinancialAnalysis,
      includeMarketAnalysis,
      includeTechnicalAnalysis,
      includeRiskAnalysis,
      includeLegalAnalysis,
      includeEnvironmentalAnalysis,
      customPrompts,
      reportFormat,
      currency,
      analysisDepth,
    } = body;

    if (!projectId || !title || !type) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // Check if project exists and belongs to user
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

    // Create feasibility study
    const study = await prisma.feasibilityStudy.create({
      data: {
        title,
        description: body.description || '',
        type,
        status: 'DRAFT',
        projectId: projectId,
        userId: session.user.id,
        language: language || 'ar',
        aiModel: aiModel || 'gemini',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    });

    return NextResponse.json(study, { status: 201 });
  } catch (error) {
    console.error('Error creating study:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء الدراسة' },
      { status: 500 }
    );
  }
}
