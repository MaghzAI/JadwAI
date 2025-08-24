import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export interface StudyData {
  id: string;
  title: string;
  description: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
  executiveSummary?: {
    overview: string;
    objectives: string;
    keyFindings: string;
    recommendations: string;
  };
  marketAnalysis?: {
    marketSize: string;
    growthRate: string;
    targetMarket: string;
    competitors: Array<{
      name: string;
      marketShare: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    opportunities: string[];
    threats: string[];
  };
  financialAnalysis?: {
    initialInvestment: number;
    projectedRevenue: Array<{
      year: number;
      revenue: number;
      expenses: number;
      profit: number;
    }>;
    breakEvenPoint: number;
    roi: number;
    npv: number;
    paybackPeriod: number;
  };
  riskAssessment?: {
    risks: Array<{
      category: string;
      description: string;
      probability: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    overallRiskRating: string;
  };
  recommendations?: {
    overallRecommendation: 'proceed' | 'proceed_with_caution' | 'not_recommended';
    reasoning: string;
    keyRecommendations: string[];
    nextSteps: string[];
    timeline: string;
  };
}

export class PDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private margin: number = 20;
  private lineHeight: number = 7;

  constructor() {
    this.doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add Arabic font support
    this.setupArabicFont();
  }

  private setupArabicFont() {
    // For now, we'll use the default font
    // In production, you would add Arabic font support
    this.doc.setFont('helvetica');
  }

  private addTitle(text: string, fontSize: number = 16, color: string = '#1f2937') {
    this.checkPageBreak(15);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(color);
    this.doc.setFont('helvetica', 'bold');
    
    // Center align for main titles
    const textWidth = this.doc.getTextWidth(text);
    const pageWidth = this.doc.internal.pageSize.width;
    const x = (pageWidth - textWidth) / 2;
    
    this.doc.text(text, x, this.currentY);
    this.currentY += fontSize * 0.5;
    
    // Add underline for main titles
    if (fontSize >= 16) {
      this.doc.line(this.margin, this.currentY, pageWidth - this.margin, this.currentY);
      this.currentY += 5;
    }
  }

  private addSubtitle(text: string, fontSize: number = 12) {
    this.checkPageBreak(10);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor('#374151');
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize * 0.6;
  }

  private addText(text: string, fontSize: number = 10, indent: number = 0) {
    if (!text) return;

    this.doc.setFontSize(fontSize);
    this.doc.setTextColor('#4b5563');
    this.doc.setFont('helvetica', 'normal');

    const maxWidth = this.doc.internal.pageSize.width - (this.margin * 2) - indent;
    const lines = this.doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(line, this.margin + indent, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addBulletPoint(text: string, fontSize: number = 10) {
    this.checkPageBreak(this.lineHeight);
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor('#4b5563');
    this.doc.setFont('helvetica', 'normal');

    const maxWidth = this.doc.internal.pageSize.width - (this.margin * 2) - 10;
    const lines = this.doc.splitTextToSize(text, maxWidth);

    this.doc.text('•', this.margin + 5, this.currentY);
    
    for (let i = 0; i < lines.length; i++) {
      this.checkPageBreak(this.lineHeight);
      this.doc.text(lines[i], this.margin + 10, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
      this.addPageHeader();
    }
  }

  private addPageHeader() {
    // Add a subtle header to subsequent pages
    this.doc.setFontSize(8);
    this.doc.setTextColor('#9ca3af');
    this.doc.text('دراسة الجدوى', this.margin, 10);
    
    const date = new Date().toLocaleDateString('ar-SA');
    const pageWidth = this.doc.internal.pageSize.width;
    const textWidth = this.doc.getTextWidth(date);
    this.doc.text(date, pageWidth - this.margin - textWidth, 10);
    
    this.currentY = 20;
  }

  private addSpacer(height: number = 5) {
    this.currentY += height;
  }

  private addTable(headers: string[], data: any[][]) {
    this.checkPageBreak(30);

    this.doc.autoTable({
      startY: this.currentY,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [75, 85, 99]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto'
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
  }

  public generateStudyPDF(data: StudyData): Uint8Array {
    // Cover Page
    this.addCoverPage(data);
    
    // Executive Summary
    if (data.executiveSummary) {
      this.addExecutiveSummary(data.executiveSummary);
    }

    // Market Analysis
    if (data.marketAnalysis) {
      this.addMarketAnalysis(data.marketAnalysis);
    }

    // Financial Analysis
    if (data.financialAnalysis) {
      this.addFinancialAnalysis(data.financialAnalysis);
    }

    // Risk Assessment
    if (data.riskAssessment) {
      this.addRiskAssessment(data.riskAssessment);
    }

    // Recommendations
    if (data.recommendations) {
      this.addRecommendations(data.recommendations);
    }

    // Footer
    this.addFooter(data);

    return this.doc.output('arraybuffer');
  }

  private addCoverPage(data: StudyData) {
    const pageWidth = this.doc.internal.pageSize.width;
    
    // Logo area (you can add company logo here)
    this.currentY = 40;
    
    // Main title
    this.doc.setFontSize(24);
    this.doc.setTextColor('#1f2937');
    this.doc.setFont('helvetica', 'bold');
    let textWidth = this.doc.getTextWidth('دراسة الجدوى الاقتصادية');
    this.doc.text('دراسة الجدوى الاقتصادية', (pageWidth - textWidth) / 2, this.currentY);
    this.currentY += 20;

    // Project title
    this.doc.setFontSize(18);
    this.doc.setTextColor('#374151');
    textWidth = this.doc.getTextWidth(data.title);
    this.doc.text(data.title, (pageWidth - textWidth) / 2, this.currentY);
    this.currentY += 15;

    // Industry
    this.doc.setFontSize(14);
    this.doc.setTextColor('#6b7280');
    const industryText = `قطاع: ${data.industry}`;
    textWidth = this.doc.getTextWidth(industryText);
    this.doc.text(industryText, (pageWidth - textWidth) / 2, this.currentY);
    this.currentY += 30;

    // Description box
    if (data.description) {
      this.doc.setDrawColor('#e5e7eb');
      this.doc.setFillColor('#f9fafb');
      const boxHeight = 40;
      this.doc.rect(this.margin, this.currentY - 5, pageWidth - 2 * this.margin, boxHeight, 'FD');
      
      this.currentY += 10;
      this.addText(data.description, 11);
      this.currentY = Math.max(this.currentY, this.currentY - 5 + boxHeight + 10);
    }

    // Date information
    this.currentY = 220;
    this.doc.setFontSize(10);
    this.doc.setTextColor('#6b7280');
    
    const createdDate = new Date(data.createdAt).toLocaleDateString('ar-SA');
    const updatedDate = new Date(data.updatedAt).toLocaleDateString('ar-SA');
    
    this.doc.text(`تاريخ الإنشاء: ${createdDate}`, this.margin, this.currentY);
    this.currentY += 7;
    this.doc.text(`آخر تحديث: ${updatedDate}`, this.margin, this.currentY);

    // Add new page for content
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private addExecutiveSummary(summary: any) {
    this.addTitle('الملخص التنفيذي', 16);
    this.addSpacer(5);

    if (summary.overview) {
      this.addSubtitle('نظرة عامة');
      this.addText(summary.overview);
      this.addSpacer();
    }

    if (summary.objectives) {
      this.addSubtitle('الأهداف');
      this.addText(summary.objectives);
      this.addSpacer();
    }

    if (summary.keyFindings) {
      this.addSubtitle('النتائج الرئيسية');
      this.addText(summary.keyFindings);
      this.addSpacer();
    }

    if (summary.recommendations) {
      this.addSubtitle('التوصيات');
      this.addText(summary.recommendations);
    }

    this.addSpacer(10);
  }

  private addMarketAnalysis(market: any) {
    this.addTitle('تحليل السوق', 16);
    this.addSpacer(5);

    // Market overview
    if (market.marketSize) {
      this.addSubtitle('حجم السوق');
      this.addText(`حجم السوق المقدر: ${market.marketSize}`);
      this.addSpacer();
    }

    if (market.growthRate) {
      this.addText(`معدل النمو السنوي: ${market.growthRate}`);
      this.addSpacer();
    }

    if (market.targetMarket) {
      this.addSubtitle('السوق المستهدف');
      this.addText(market.targetMarket);
      this.addSpacer();
    }

    // Competitors
    if (market.competitors && market.competitors.length > 0) {
      this.addSubtitle('تحليل المنافسين');
      
      const competitorData = market.competitors.map((comp: any) => [
        comp.name,
        comp.marketShare,
        comp.strengths?.join(', ') || '',
        comp.weaknesses?.join(', ') || ''
      ]);

      this.addTable(
        ['اسم المنافس', 'الحصة السوقية', 'نقاط القوة', 'نقاط الضعف'],
        competitorData
      );
    }

    // Opportunities and Threats
    if (market.opportunities && market.opportunities.length > 0) {
      this.addSubtitle('الفرص');
      market.opportunities.forEach((opp: string) => {
        this.addBulletPoint(opp);
      });
      this.addSpacer();
    }

    if (market.threats && market.threats.length > 0) {
      this.addSubtitle('التهديدات');
      market.threats.forEach((threat: string) => {
        this.addBulletPoint(threat);
      });
    }

    this.addSpacer(10);
  }

  private addFinancialAnalysis(financial: any) {
    this.addTitle('التحليل المالي', 16);
    this.addSpacer(5);

    // Investment overview
    if (financial.initialInvestment) {
      this.addSubtitle('الاستثمار المبدئي');
      this.addText(`الاستثمار المطلوب: ${financial.initialInvestment.toLocaleString()} ريال سعودي`);
      this.addSpacer();
    }

    // Key metrics
    const metrics = [];
    if (financial.roi !== undefined) metrics.push(['العائد على الاستثمار (ROI)', `${financial.roi}%`]);
    if (financial.npv !== undefined) metrics.push(['صافي القيمة الحالية (NPV)', `${financial.npv.toLocaleString()} ريال`]);
    if (financial.paybackPeriod !== undefined) metrics.push(['فترة الاسترداد', `${financial.paybackPeriod} سنة`]);
    if (financial.breakEvenPoint !== undefined) metrics.push(['نقطة التعادل', `${financial.breakEvenPoint.toLocaleString()} ريال`]);

    if (metrics.length > 0) {
      this.addSubtitle('المؤشرات المالية الرئيسية');
      this.addTable(['المؤشر', 'القيمة'], metrics);
    }

    // Revenue projections
    if (financial.projectedRevenue && financial.projectedRevenue.length > 0) {
      this.addSubtitle('التوقعات المالية');
      
      const projectionData = financial.projectedRevenue.map((proj: any) => [
        `السنة ${proj.year}`,
        proj.revenue.toLocaleString(),
        proj.expenses.toLocaleString(),
        proj.profit.toLocaleString()
      ]);

      this.addTable(
        ['السنة', 'الإيرادات', 'المصروفات', 'الربح الصافي'],
        projectionData
      );
    }

    this.addSpacer(10);
  }

  private addRiskAssessment(risk: any) {
    this.addTitle('تقييم المخاطر', 16);
    this.addSpacer(5);

    if (risk.overallRiskRating) {
      this.addSubtitle('التقييم العام للمخاطر');
      this.addText(`مستوى المخاطر العام: ${risk.overallRiskRating}`);
      this.addSpacer();
    }

    if (risk.risks && risk.risks.length > 0) {
      this.addSubtitle('المخاطر المحددة');

      const riskData = risk.risks.map((r: any) => [
        r.category,
        r.description,
        r.probability === 'high' ? 'عالي' : r.probability === 'medium' ? 'متوسط' : 'منخفض',
        r.impact === 'high' ? 'عالي' : r.impact === 'medium' ? 'متوسط' : 'منخفض',
        r.mitigation
      ]);

      this.addTable(
        ['الفئة', 'الوصف', 'الاحتمالية', 'التأثير', 'استراتيجية التخفيف'],
        riskData
      );
    }

    this.addSpacer(10);
  }

  private addRecommendations(rec: any) {
    this.addTitle('التوصيات والخلاصة', 16);
    this.addSpacer(5);

    // Overall recommendation
    if (rec.overallRecommendation) {
      this.addSubtitle('التوصية العامة');
      let recText = '';
      switch (rec.overallRecommendation) {
        case 'proceed':
          recText = '✓ يُنصح بالمضي قدماً في المشروع';
          break;
        case 'proceed_with_caution':
          recText = '⚠ يُنصح بالمضي قدماً مع الحذر';
          break;
        case 'not_recommended':
          recText = '✗ لا يُنصح بالمضي قدماً في المشروع';
          break;
      }
      this.addText(recText, 12);
      this.addSpacer();
    }

    if (rec.reasoning) {
      this.addSubtitle('التبرير');
      this.addText(rec.reasoning);
      this.addSpacer();
    }

    if (rec.keyRecommendations && rec.keyRecommendations.length > 0) {
      this.addSubtitle('التوصيات الرئيسية');
      rec.keyRecommendations.forEach((recommendation: string) => {
        this.addBulletPoint(recommendation);
      });
      this.addSpacer();
    }

    if (rec.nextSteps && rec.nextSteps.length > 0) {
      this.addSubtitle('الخطوات التالية');
      rec.nextSteps.forEach((step: string, index: number) => {
        this.addBulletPoint(`${index + 1}. ${step}`);
      });
      this.addSpacer();
    }

    if (rec.timeline) {
      this.addSubtitle('الجدول الزمني المقترح');
      this.addText(rec.timeline);
    }
  }

  private addFooter(data: StudyData) {
    // Add final page with disclaimer
    this.doc.addPage();
    this.currentY = this.margin;

    this.addTitle('إخلاء مسؤولية', 14);
    this.addSpacer();

    const disclaimer = `
تم إعداد هذه الدراسة بناءً على البيانات والمعلومات المتاحة وقت الإعداد. النتائج والتوصيات الواردة في هذه الدراسة هي تقديرات وتوقعات قد تختلف عن النتائج الفعلية.

يُنصح بمراجعة متخصصين في المجال قبل اتخاذ قرارات استثمارية مهمة. لا تتحمل منصة دراسات الجدوى أي مسؤولية عن القرارات المتخذة بناءً على هذه الدراسة.

هذه الدراسة محمية بحقوق الطبع والنشر ولا يجوز استخدامها أو نشرها دون إذن مسبق.
    `.trim();

    this.addText(disclaimer, 9);

    // Add page numbers
    const pageCount = this.doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor('#9ca3af');
      const pageText = `صفحة ${i} من ${pageCount}`;
      const pageWidth = this.doc.internal.pageSize.width;
      const textWidth = this.doc.getTextWidth(pageText);
      this.doc.text(pageText, pageWidth - this.margin - textWidth, this.pageHeight - 10);
    }
  }
}
