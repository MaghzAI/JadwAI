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

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'last_6_months';

    // Get user's projects and studies data
    const userProjects = await prisma.project.findMany({
      where: { userId: session.user.id },
      include: {
        studies: true,
        _count: {
          select: {
            studies: true
          }
        }
      }
    });

    const userStudies = await prisma.feasibilityStudy.findMany({
      where: { userId: session.user.id }
    });

    // Calculate analytics data
    const totalProjects = userProjects.length;
    const totalStudies = userStudies.length;
    const completedStudies = userStudies.filter(s => s.status === 'COMPLETED').length;
    const activeProjects = userProjects.filter(p => p.status === 'ACTIVE').length;

    // Group studies by industry
    const industryData = userProjects.reduce((acc, project) => {
      const industry = project.industry || 'أخرى';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate financial metrics
    const totalRevenue = userStudies.reduce((sum, study) => 
      sum + (study.expectedRevenue || 0), 0
    );
    
    const totalCost = userStudies.reduce((sum, study) => 
      sum + (study.totalCost || 0), 0
    );

    // Generate monthly trends (mock data for now)
    const monthlyData = [];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    
    for (let i = 0; i < 6; i++) {
      const projectsThisMonth = Math.floor(totalProjects / 6) + Math.floor(Math.random() * 3);
      const studiesThisMonth = Math.floor(totalStudies / 6) + Math.floor(Math.random() * 2);
      const revenueThisMonth = totalRevenue / 6 + Math.random() * (totalRevenue * 0.2);
      
      monthlyData.push({
        month: months[i],
        projects: projectsThisMonth,
        studies: studiesThisMonth,
        revenue: Math.round(revenueThisMonth)
      });
    }

    const analyticsData = {
      overview: {
        totalProjects,
        totalStudies,
        totalUsers: 1, // Current user for now
        activeProjects,
        completedStudies,
        pendingStudies: totalStudies - completedStudies
      },
      trends: {
        projectsCreated: monthlyData.map(m => ({ month: m.month, count: m.projects })),
        studiesCompleted: monthlyData.map(m => ({ month: m.month, count: m.studies })),
        userGrowth: monthlyData.map(m => ({ month: m.month, users: 1 }))
      },
      performance: {
        avgCompletionTime: 12.5,
        studyQualityScore: 8.4,
        userSatisfaction: 4.6,
        exportCount: totalStudies * 2, // Assume 2 exports per study
        shareCount: Math.floor(totalProjects * 0.3) // 30% shared
      },
      usage: {
        byIndustry: Object.entries(industryData).map(([industry, count]) => ({
          industry,
          count,
          percentage: Math.round((count / totalProjects) * 100)
        })),
        byRegion: [
          { region: 'الرياض', count: Math.ceil(totalProjects * 0.4) },
          { region: 'جدة', count: Math.ceil(totalProjects * 0.3) },
          { region: 'الدمام', count: Math.ceil(totalProjects * 0.2) },
          { region: 'أخرى', count: Math.ceil(totalProjects * 0.1) }
        ],
        byFeature: [
          { feature: 'مولد المحتوى بالذكاء الاصطناعي', usage: 85 },
          { feature: 'التحليل المالي', usage: 78 },
          { feature: 'تحليل السوق', usage: 72 },
          { feature: 'تقييم المخاطر', usage: 68 },
          { feature: 'التصدير إلى PDF', usage: 92 },
          { feature: 'المشاركة التعاونية', usage: 45 }
        ]
      },
      financial: {
        totalRevenue,
        avgProjectValue: totalRevenue / (totalProjects || 1),
        revenueByMonth: monthlyData.map(m => ({ month: m.month, revenue: m.revenue })),
        topIndustries: Object.entries(industryData).map(([industry, count]) => ({
          industry,
          revenue: Math.round((count / totalProjects) * totalRevenue)
        })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
