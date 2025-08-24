import { NextRequest, NextResponse } from 'next/server';

// API مبسط للمشاريع للتطوير
export async function GET(request: NextRequest) {
  try {
    // Mock projects data للتطوير
    const projects = [
      {
        id: 1,
        name: 'مطعم الأصالة',
        type: 'مطعم',
        industry: 'مطاعم',
        description: 'مطعم يقدم الأكلات التراثية السعودية',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'متجر الإلكترونيات الذكية',
        type: 'تجارة إلكترونية',
        industry: 'تكنولوجيا',
        description: 'متجر إلكتروني متخصص في بيع الأجهزة الذكية',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'مركز التدريب التقني',
        type: 'تعليم',
        industry: 'تعليم وتدريب',
        description: 'مركز تدريب متخصص في المهارات التقنية والبرمجية',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'مركز اللياقة البدنية',
        type: 'خدمات',
        industry: 'صحة ولياقة',
        description: 'مركز رياضي متكامل للياقة البدنية والصحة',
        status: 'PLANNING',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        name: 'متجر الأزياء العصرية',
        type: 'أزياء',
        industry: 'موضة وأزياء',
        description: 'متجر متخصص في الأزياء العصرية للشباب',
        status: 'PLANNING',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      projects,
      pagination: {
        page: 1,
        limit: 10,
        total: projects.length,
        pages: 1,
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
    const body = await request.json();
    
    console.log('Creating project with data:', body);
    
    // Validate basic required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'اسم المشروع مطلوب' },
        { status: 400 }
      );
    }

    // Mock created project for development
    const project = {
      id: Date.now(),
      name: body.name,
      type: body.type || 'عام',
      industry: body.industry || 'عام',
      description: body.description || '',
      status: 'PLANNING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Project created successfully:', project);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء المشروع: ' + error.message },
      { status: 500 }
    );
  }
}
