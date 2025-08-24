import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai/providers/gemini';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    console.log('AI Generation Request:', { type, data });

    let result;
    
    switch (type) {
      case 'executive_summary':
        result = await geminiService.generateExecutiveSummary(data);
        break;
      
      case 'market_analysis':
        result = await geminiService.generateMarketAnalysis(data);
        break;
      
      case 'risk_assessment':
        result = await geminiService.generateRiskAssessment(data);
        break;
      
      case 'recommendations':
        result = await geminiService.generateRecommendations(data);
        break;
      
      default:
        return NextResponse.json(
          { error: 'نوع غير مدعوم من المحتوى' },
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      success: true, 
      data: result,
      generated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطأ في توليد المحتوى بالذكاء الاصطناعي:', error);
    
    return NextResponse.json(
      { 
        error: 'حدث خطأ في توليد المحتوى',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}

// GET endpoint للاختبار
export async function GET() {
  return NextResponse.json({
    message: 'AI Generation API جاهز للاستخدام',
    supported_types: [
      'executive_summary',
      'market_analysis', 
      'risk_assessment',
      'recommendations'
    ],
    timestamp: new Date().toISOString()
  });
}
