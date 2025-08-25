import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    
    console.log('Fetching study with ID:', id);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const study = await prisma.feasibilityStudy.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            industry: true,
            description: true
          }
        }
      }
    });

    if (!study) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة' },
        { status: 404 }
      );
    }
    // Parse JSON fields if they exist and are strings
    let parsedStudy = { ...study };
    
    if (study.marketAnalysis && typeof study.marketAnalysis === 'string') {
      try {
        parsedStudy.marketAnalysis = JSON.parse(study.marketAnalysis);
      } catch (e) {
        console.error('Error parsing marketAnalysis:', e);
      }
    }
    
    if (study.technicalAnalysis && typeof study.technicalAnalysis === 'string') {
      try {
        parsedStudy.technicalAnalysis = JSON.parse(study.technicalAnalysis);
      } catch (e) {
        console.error('Error parsing technicalAnalysis:', e);
      }
    }
    
    if (study.financialAnalysis && typeof study.financialAnalysis === 'string') {
      try {
        parsedStudy.financialAnalysis = JSON.parse(study.financialAnalysis);
      } catch (e) {
        console.error('Error parsing financialAnalysis:', e);
      }
    }
    
    if (study.riskAnalysis && typeof study.riskAnalysis === 'string') {
      try {
        parsedStudy.riskAnalysis = JSON.parse(study.riskAnalysis);
      } catch (e) {
        console.error('Error parsing riskAnalysis:', e);
      }
    }

    return NextResponse.json(parsedStudy);
  } catch (error) {
    console.error('Error fetching study:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب الدراسة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    console.log('Updating study with ID:', id);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Verify ownership
    const existingStudy = await prisma.feasibilityStudy.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!existingStudy) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة أو ليس لديك صلاحية التعديل' },
        { status: 404 }
      );
    }

    // Update the study
    const updatedStudy = await prisma.feasibilityStudy.update({
      where: { id: id },
      data: {
        title: body.title || existingStudy.title,
        description: body.description !== undefined ? body.description : existingStudy.description,
        type: body.type || existingStudy.type,
        status: body.status || existingStudy.status,
        executiveSummary: body.executiveSummary !== undefined ? body.executiveSummary : existingStudy.executiveSummary,
        marketAnalysis: body.marketAnalysis !== undefined ? JSON.stringify(body.marketAnalysis) : existingStudy.marketAnalysis,
        technicalAnalysis: body.technicalAnalysis !== undefined ? JSON.stringify(body.technicalAnalysis) : existingStudy.technicalAnalysis,
        financialAnalysis: body.financialAnalysis !== undefined ? JSON.stringify(body.financialAnalysis) : existingStudy.financialAnalysis,
        riskAnalysis: body.riskAnalysis !== undefined ? JSON.stringify(body.riskAnalysis) : existingStudy.riskAnalysis,
        riskAssessment: body.riskAssessment !== undefined ? body.riskAssessment : existingStudy.riskAssessment,
        recommendations: body.recommendations !== undefined ? body.recommendations : existingStudy.recommendations,
        totalCost: body.totalCost !== undefined ? body.totalCost : existingStudy.totalCost,
        expectedRevenue: body.expectedRevenue !== undefined ? body.expectedRevenue : existingStudy.expectedRevenue,
        roi: body.roi !== undefined ? body.roi : existingStudy.roi,
        npv: body.npv !== undefined ? body.npv : existingStudy.npv,
        irr: body.irr !== undefined ? body.irr : existingStudy.irr,
        breakEvenPeriod: body.breakEvenPeriod !== undefined ? body.breakEvenPeriod : existingStudy.breakEvenPeriod
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

    return NextResponse.json(updatedStudy);
  } catch (error) {
    console.error('Error updating study:', error);
    return NextResponse.json(
      { error: 'خطأ في تحديث الدراسة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
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
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await params;
    
    console.log('Deleting study with ID:', id);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Verify ownership before deletion
    const study = await prisma.feasibilityStudy.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    });

    if (!study) {
      return NextResponse.json(
        { error: 'الدراسة غير موجودة أو ليس لديك صلاحية الحذف' },
        { status: 404 }
      );
    }

    // Delete the study
    await prisma.feasibilityStudy.delete({
      where: { id: id }
    });
    
    return NextResponse.json(
      { message: 'تم حذف الدراسة بنجاح' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting study:', error);
    return NextResponse.json(
      { error: 'خطأ في حذف الدراسة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف') },
      { status: 500 }
    );
  }
}
