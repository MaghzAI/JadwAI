import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProjectStatus, ProjectType } from '@prisma/client';

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
    const status = searchParams.get('status') as ProjectStatus | 'all';
    const type = searchParams.get('type') as ProjectType | 'all';

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects with pagination
    const projects = await prisma.project.findMany({
      where,
      include: {
        feasibilityStudies: {
          select: {
            id: true,
            status: true,
            createdAt: true,
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
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب المشاريع' },
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
      name,
      description,
      type,
      industry,
      location,
      currency,
      initialInvestment,
      expectedRevenue,
      targetMarket,
      projectDuration,
      teamSize,
      businessModel,
      competitiveAdvantage,
      risks,
      successMetrics,
    } = body;

    if (!name || !type || !industry) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        type,
        industry,
        location,
        currency: currency || 'SAR',
        initialInvestment: initialInvestment ? parseFloat(initialInvestment) : null,
        expectedRevenue: expectedRevenue ? parseFloat(expectedRevenue) : null,
        targetMarket,
        projectDuration: projectDuration ? parseInt(projectDuration) : null,
        teamSize: teamSize ? parseInt(teamSize) : null,
        businessModel,
        competitiveAdvantage,
        risks,
        successMetrics,
        status: 'PLANNING',
        userId: session.user.id,
      },
      include: {
        feasibilityStudies: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء المشروع' },
      { status: 500 }
    );
  }
}
