import { NextRequest, NextResponse } from 'next/server';

// API مبسط لجلب دراسة واحدة للتطوير
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Fetching study with ID:', id);
    
    // Mock study data for development
    const study = {
      id: id,
      title: 'دراسة جدوى تجريبية',
      description: 'هذه دراسة جدوى تجريبية تم إنشاؤها للتطوير والاختبار',
      type: 'comprehensive',
      status: 'DRAFT',
      language: 'ar',
      aiModel: 'gemini',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: '1',
      project: {
        id: '1',
        name: 'مشروع تجريبي',
        industry: 'عام',
        description: 'مشروع تجريبي للتطوير'
      },
      // Mock feasibility study data
      executiveSummary: {
        projectIdea: 'فكرة مشروع تجريبية لأغراض التطوير والاختبار',
        objectives: 'الهدف من هذا المشروع هو اختبار وتطوير النظام',
        targetAudience: 'المطورون والمختبرون',
      },
      marketAnalysis: {
        marketSize: '100 مليون ريال',
        growthRate: '15%',
        customerSegments: [
          { name: 'الشباب', size: 40, characteristics: 'يفضلون التقنية الحديثة' },
          { name: 'العائلات', size: 35, characteristics: 'يبحثون عن الجودة والأمان' }
        ],
        competitors: [
          { name: 'منافس أول', marketShare: 25, strengths: 'قوي في التسويق' },
          { name: 'منافس ثاني', marketShare: 20, strengths: 'أسعار تنافسية' }
        ]
      },
      financialAnalysis: {
        initialInvestment: 500000,
        projections: [
          { year: 1, revenue: 200000, expenses: 150000, profit: 50000 },
          { year: 2, revenue: 300000, expenses: 200000, profit: 100000 },
          { year: 3, revenue: 450000, expenses: 280000, profit: 170000 }
        ],
        expenseCategories: [
          { category: 'رواتب', amount: 120000 },
          { category: 'إيجار', amount: 60000 },
          { category: 'تسويق', amount: 40000 }
        ]
      },
      technicalAnalysis: {
        technicalRequirements: [
          {
            category: 'الأجهزة والبنية التحتية',
            requirement: 'خوادم عالية الأداء للتطبيق',
            priority: 'high',
            status: 'required'
          }
        ],
        technologies: [
          {
            name: 'React.js',
            category: 'تطوير الواجهة',
            purpose: 'بناء واجهة المستخدم',
            alternatives: ['Vue.js', 'Angular']
          }
        ],
        infrastructure: 'بنية تحتية مبنية على الحوسبة السحابية مع خوادم AWS'
      },
      riskAssessment: {
        risks: [
          {
            category: 'مالية',
            description: 'عدم توفر السيولة الكافية',
            probability: 'medium',
            impact: 'high',
            mitigation: 'الحصول على تمويل إضافي',
            contingency: 'تقليل النفقات التشغيلية'
          },
          {
            category: 'تقنية',
            description: 'مشاكل في الأداء التقني',
            probability: 'low',
            impact: 'medium',
            mitigation: 'اختبارات شاملة قبل الإطلاق',
            contingency: 'فريق دعم تقني متخصص'
          }
        ],
        overallRiskLevel: 'medium',
        riskManagementStrategy: 'استراتيجية شاملة لإدارة المخاطر تشمل المراقبة المستمرة والتقييم الدوري'
      },
      review: {
        studyTitle: 'دراسة جدوى تجريبية شاملة',
        finalRecommendation: 'نوصي بالمضي قدماً في المشروع مع مراعاة المخاطر المحددة',
        nextSteps: 'البدء في مرحلة التخطيط التفصيلي وتشكيل الفريق',
        additionalNotes: 'هذه دراسة تجريبية لأغراض التطوير'
      }
    };

    return NextResponse.json(study);
  } catch (error) {
    console.error('Error fetching study:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الدراسة: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating study with ID:', id, 'Data:', body);
    
    // Mock updated study for development
    const updatedStudy = {
      id: id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedStudy);
  } catch (error) {
    console.error('Error updating study:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث الدراسة: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Deleting study with ID:', id);
    
    return NextResponse.json(
      { message: 'تم حذف الدراسة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting study:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف الدراسة: ' + error.message },
      { status: 500 }
    );
  }
}
