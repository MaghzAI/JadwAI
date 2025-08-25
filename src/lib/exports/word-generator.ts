import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType } from 'docx';
import { StudyData } from './pdf-generator';

export class WordGenerator {
  public async generateStudyDocument(data: StudyData): Promise<Blob> {
    const document = new Document({
      sections: [{
        children: [
          // Cover Page
          new Paragraph({
            children: [
              new TextRun({
                text: "دراسة الجدوى الاقتصادية",
                size: 48,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.title,
                size: 36,
                bold: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `قطاع: ${data.industry}`,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          
          // Executive Summary
          ...(data.executiveSummary ? [
            new Paragraph({
              children: [new TextRun({ text: "الملخص التنفيذي", size: 32, bold: true })],
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: true,
            }),
            new Paragraph({
              children: [new TextRun({ text: data.executiveSummary.overview || '', size: 22 })],
              spacing: { after: 200 },
            }),
          ] : []),

          // Market Analysis
          ...(data.marketAnalysis ? [
            new Paragraph({
              children: [new TextRun({ text: "تحليل السوق", size: 32, bold: true })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: `حجم السوق: ${data.marketAnalysis.marketSize || ''}`, size: 22 })],
              spacing: { after: 200 },
            }),
          ] : []),

          // Financial Analysis
          ...(data.financialAnalysis ? [
            new Paragraph({
              children: [new TextRun({ text: "التحليل المالي", size: 32, bold: true })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: `الاستثمار المبدئي: ${data.financialAnalysis.initialInvestment?.toLocaleString() || ''} ريال`, size: 22 })],
              spacing: { after: 200 },
            }),
          ] : []),

          // Risk Assessment
          ...(data.riskAssessment ? [
            new Paragraph({
              children: [new TextRun({ text: "تقييم المخاطر", size: 32, bold: true })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: `التقييم العام: ${data.riskAssessment.overallRiskRating || ''}`, size: 22 })],
              spacing: { after: 200 },
            }),
          ] : []),

          // Recommendations
          ...(data.recommendations ? [
            new Paragraph({
              children: [new TextRun({ text: "التوصيات", size: 32, bold: true })],
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun({ text: data.recommendations.reasoning || '', size: 22 })],
              spacing: { after: 200 },
            }),
          ] : []),

          // Footer
          new Paragraph({
            children: [new TextRun({ text: "إخلاء مسؤولية", size: 24, bold: true })],
            pageBreakBefore: true,
          }),
          new Paragraph({
            children: [new TextRun({ 
              text: "تم إعداد هذه الدراسة بناءً على البيانات المتاحة. النتائج تقديرية وقد تختلف عن الواقع.",
              size: 20 
            })],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(document);
    return new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }
}
