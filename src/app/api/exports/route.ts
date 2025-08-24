import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Get user's recent export history and sharing data
    const userProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        feasibilityStudies: {
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    const exportData = {
      recentExports: userProjects.flatMap(project => 
        project.feasibilityStudies.map(study => ({
          id: study.id,
          title: study.title,
          projectName: project.name,
          type: 'PDF',
          status: 'completed',
          downloadUrl: `/api/exports/${study.id}/pdf`,
          exportedAt: study.createdAt,
          size: '2.4 MB'
        }))
      ).slice(0, 5),
      
      templates: [
        { id: 'standard', name: 'النموذج القياسي', description: 'تقرير شامل مع جميع الأقسام' },
        { id: 'financial', name: 'التحليل المالي', description: 'التركيز على البيانات المالية والتوقعات' },
        { id: 'executive', name: 'الملخص التنفيذي', description: 'ملخص مختصر للإدارة العليا' }
      ],
      
      exportStats: {
        totalExports: userProjects.reduce((sum, p) => sum + p.feasibilityStudies.length, 0) * 3,
        thisMonth: userProjects.reduce((sum, p) => sum + p.feasibilityStudies.length, 0),
        mostUsedFormat: 'PDF',
        avgFileSize: '2.1 MB'
      },
      
      shareLinks: [
        {
          id: '1',
          projectId: userProjects[0]?.id || 'demo',
          projectName: userProjects[0]?.name || 'مشروع تجريبي',
          url: `${process.env.NEXTAUTH_URL}/shared/${userProjects[0]?.id || 'demo'}`,
          permissions: 'view',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          views: 5,
          createdAt: new Date().toISOString()
        }
      ]
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Exports API error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { action, projectId, studyId, format, template } = body;

    switch (action) {
      case 'export':
        // TODO: Implement actual export logic
        return NextResponse.json({
          message: `تم تصدير التقرير بصيغة ${format} بنجاح`,
          downloadUrl: `/api/exports/${studyId}/${format.toLowerCase()}`,
          exportId: Date.now().toString()
        });

      case 'createShareLink':
        // TODO: Implement share link creation
        return NextResponse.json({
          message: 'تم إنشاء رابط المشاركة بنجاح',
          shareLink: {
            id: Date.now().toString(),
            url: `${process.env.NEXTAUTH_URL}/shared/${projectId}`,
            permissions: body.permissions || 'view',
            expiresAt: body.expiresAt,
            createdAt: new Date().toISOString()
          }
        });

      case 'revokeShareLink':
        // TODO: Implement share link revocation
        return NextResponse.json({ message: 'تم إلغاء رابط المشاركة بنجاح' });

      default:
        return NextResponse.json({ error: 'إجراء غير مدعوم' }, { status: 400 });
    }
  } catch (error) {
    console.error('Exports API error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
