import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { StudyStatus, StudyType } from '@prisma/client';

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
      where.projectId = parseInt(projectId);
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
            type: true,
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

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
        id: parseInt(projectId),
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Create study configuration
    const configuration = {
      language: language || 'ar',
      aiModel: aiModel || 'gemini',
      includeFinancialAnalysis: includeFinancialAnalysis !== false,
      includeMarketAnalysis: includeMarketAnalysis !== false,
      includeTechnicalAnalysis: includeTechnicalAnalysis !== false,
      includeRiskAnalysis: includeRiskAnalysis !== false,
      includeLegalAnalysis: includeLegalAnalysis === true,
      includeEnvironmentalAnalysis: includeEnvironmentalAnalysis === true,
      customPrompts: customPrompts || '',
      reportFormat: reportFormat || 'detailed',
      currency: currency || project.currency || 'SAR',
      analysisDepth: analysisDepth || 'comprehensive',
    };

    // Create feasibility study
    const study = await prisma.feasibilityStudy.create({
      data: {
        title,
        description: body.description || '',
        type,
        status: 'DRAFT',
        projectId: parseInt(projectId),
        configuration,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            type: true,
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
