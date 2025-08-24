import { NextRequest, NextResponse } from 'next/server';

// API مبسط للتطوير بدون مصادقة معقدة
export async function GET(request: NextRequest) {
  try {
    // Mock data للتطوير
    const studies = [
      {
        id: '1',
        title: 'دراسة جدوى مطعم الأصالة',
        description: 'دراسة شاملة لمشروع مطعم يقدم الأكلات التراثية',
        type: 'comprehensive',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        project: {
          id: '1',
          name: 'مطعم الأصالة',
          industry: 'مطاعم'
        }
      },
      {
        id: '2',
        title: 'دراسة جدوى متجر إلكتروني',
        description: 'تحليل السوق والجدوى المالية لمتجر إلكتروني',
        type: 'economic',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        project: {
          id: '2',
          name: 'متجر الإلكترونيات الذكية',
          industry: 'تجارة إلكترونية'
        }
      }
    ];

    return NextResponse.json({
      studies,
      pagination: {
        page: 1,
        limit: 10,
        total: studies.length,
        pages: 1,
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
    const body = await request.json();
    
    console.log('Creating study with data:', body);
    
    // Validate basic required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'عنوان الدراسة مطلوب' },
        { status: 400 }
      );
    }

    // Mock created study for development
    const study = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || '',
      type: body.studyType || body.type || 'comprehensive',
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: body.language || 'ar',
      aiModel: body.aiModel || 'gemini',
      projectId: body.projectId || '1',
      project: {
        id: body.projectId || '1',
        name: 'مشروع تجريبي',
        industry: 'عام'
      }
    };

    console.log('Study created successfully:', study);

    return NextResponse.json(study, { status: 201 });
  } catch (error) {
    console.error('Error creating study:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء الدراسة: ' + error.message },
      { status: 500 }
    );
  }
}
