import * as XLSX from 'exceljs';
import { StudyData } from './pdf-generator';

export class ExcelGenerator {
  private workbook: XLSX.Workbook;

  constructor() {
    this.workbook = new XLSX.Workbook();
    this.workbook.creator = 'منصة دراسات الجدوى';
    this.workbook.created = new Date();
  }

  public async generateFinancialExcel(data: StudyData): Promise<Buffer> {
    // Summary Sheet
    this.createSummarySheet(data);

    // Financial Projections
    if (data.financialAnalysis?.projectedRevenue) {
      this.createProjectionsSheet(data.financialAnalysis);
    }

    // Market Analysis
    if (data.marketAnalysis) {
      this.createMarketSheet(data.marketAnalysis);
    }

    // Risk Analysis
    if (data.riskAssessment) {
      this.createRiskSheet(data.riskAssessment);
    }

    return await this.workbook.xlsx.writeBuffer() as unknown as Buffer;
  }

  private createSummarySheet(data: StudyData) {
    const worksheet = this.workbook.addWorksheet('ملخص الدراسة');
    
    // Headers styling
    const headerStyle = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F2937' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    const dataStyle = {
      font: { size: 12 },
      alignment: { horizontal: 'right', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    // Title
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = `دراسة الجدوى - ${data.title}`;
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 18, color: { argb: '1F2937' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    worksheet.getRow(1).height = 30;

    // Basic Information
    let row = 3;
    worksheet.getCell(`A${row}`).value = 'معلومات أساسية';
    worksheet.getCell(`A${row}`).style = headerStyle;
    worksheet.mergeCells(`A${row}:D${row}`);
    
    row++;
    this.addDataRow(worksheet, row++, 'اسم المشروع', data.title, headerStyle, dataStyle);
    this.addDataRow(worksheet, row++, 'القطاع', data.industry, headerStyle, dataStyle);
    this.addDataRow(worksheet, row++, 'تاريخ الإنشاء', new Date(data.createdAt).toLocaleDateString('ar-SA'), headerStyle, dataStyle);
    this.addDataRow(worksheet, row++, 'آخر تحديث', new Date(data.updatedAt).toLocaleDateString('ar-SA'), headerStyle, dataStyle);

    // Financial Summary
    if (data.financialAnalysis) {
      row++;
      worksheet.getCell(`A${row}`).value = 'الملخص المالي';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:D${row}`);
      
      row++;
      if (data.financialAnalysis.initialInvestment) {
        this.addDataRow(worksheet, row++, 'الاستثمار المبدئي', 
          `${data.financialAnalysis.initialInvestment.toLocaleString()} ريال`, headerStyle, dataStyle);
      }
      if (data.financialAnalysis.roi !== undefined) {
        this.addDataRow(worksheet, row++, 'العائد على الاستثمار', 
          `${data.financialAnalysis.roi}%`, headerStyle, dataStyle);
      }
      if (data.financialAnalysis.paybackPeriod !== undefined) {
        this.addDataRow(worksheet, row++, 'فترة الاسترداد', 
          `${data.financialAnalysis.paybackPeriod} سنة`, headerStyle, dataStyle);
      }
      if (data.financialAnalysis.npv !== undefined) {
        this.addDataRow(worksheet, row++, 'صافي القيمة الحالية', 
          `${data.financialAnalysis.npv.toLocaleString()} ريال`, headerStyle, dataStyle);
      }
    }

    // Market Information
    if (data.marketAnalysis) {
      row++;
      worksheet.getCell(`A${row}`).value = 'معلومات السوق';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:D${row}`);
      
      row++;
      if (data.marketAnalysis.marketSize) {
        this.addDataRow(worksheet, row++, 'حجم السوق', data.marketAnalysis.marketSize, headerStyle, dataStyle);
      }
      if (data.marketAnalysis.growthRate) {
        this.addDataRow(worksheet, row++, 'معدل النمو', data.marketAnalysis.growthRate, headerStyle, dataStyle);
      }
      if (data.marketAnalysis.targetMarket) {
        this.addDataRow(worksheet, row++, 'السوق المستهدف', data.marketAnalysis.targetMarket, headerStyle, dataStyle);
      }
    }

    // Adjust column widths
    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('B').width = 40;
    worksheet.getColumn('C').width = 15;
    worksheet.getColumn('D').width = 15;
  }

  private createProjectionsSheet(financial: any) {
    const worksheet = this.workbook.addWorksheet('التوقعات المالية');
    
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F2937' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    const numberStyle = {
      font: { size: 11 },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '#,##0',
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    // Title
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'التوقعات المالية (بالريال السعودي)';
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    // Headers
    const headers = ['السنة', 'الإيرادات', 'المصروفات', 'الربح الصافي', 'الربح التراكمي'];
    let row = 3;
    
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(row, index + 1);
      cell.value = header;
      cell.style = headerStyle;
    });

    // Data
    row++;
    let cumulativeProfit = 0;
    financial.projectedRevenue.forEach((proj: any) => {
      cumulativeProfit += proj.profit;
      
      worksheet.getCell(row, 1).value = `السنة ${proj.year}`;
      worksheet.getCell(row, 1).style = { ...numberStyle, alignment: { horizontal: 'center', vertical: 'middle' } };
      
      worksheet.getCell(row, 2).value = proj.revenue;
      worksheet.getCell(row, 2).style = numberStyle;
      
      worksheet.getCell(row, 3).value = proj.expenses;
      worksheet.getCell(row, 3).style = numberStyle;
      
      worksheet.getCell(row, 4).value = proj.profit;
      worksheet.getCell(row, 4).style = {
        ...numberStyle,
        font: { ...numberStyle.font, color: proj.profit >= 0 ? { argb: '059669' } : { argb: 'DC2626' } }
      };
      
      worksheet.getCell(row, 5).value = cumulativeProfit;
      worksheet.getCell(row, 5).style = {
        ...numberStyle,
        font: { ...numberStyle.font, color: cumulativeProfit >= 0 ? { argb: '059669' } : { argb: 'DC2626' } }
      };
      
      row++;
    });

    // Add totals row
    const totalRow = row;
    worksheet.getCell(totalRow, 1).value = 'الإجمالي';
    worksheet.getCell(totalRow, 1).style = { ...headerStyle, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } } };

    const totalRevenue = financial.projectedRevenue.reduce((sum: number, proj: any) => sum + proj.revenue, 0);
    const totalExpenses = financial.projectedRevenue.reduce((sum: number, proj: any) => sum + proj.expenses, 0);
    const totalProfit = financial.projectedRevenue.reduce((sum: number, proj: any) => sum + proj.profit, 0);

    worksheet.getCell(totalRow, 2).value = totalRevenue;
    worksheet.getCell(totalRow, 2).style = { ...headerStyle, numFmt: '#,##0', fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } } };
    
    worksheet.getCell(totalRow, 3).value = totalExpenses;
    worksheet.getCell(totalRow, 3).style = { ...headerStyle, numFmt: '#,##0', fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } } };
    
    worksheet.getCell(totalRow, 4).value = totalProfit;
    worksheet.getCell(totalRow, 4).style = { ...headerStyle, numFmt: '#,##0', fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '374151' } } };

    // Adjust column widths
    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 18;
    worksheet.getColumn('C').width = 18;
    worksheet.getColumn('D').width = 18;
    worksheet.getColumn('E').width = 18;

    // Add chart (simple data for visualization)
    row += 2;
    worksheet.getCell(row, 1).value = 'ملاحظات:';
    worksheet.getCell(row, 1).style = { font: { bold: true, size: 12 } };
    row++;
    worksheet.getCell(row, 1).value = '• الأرقام الخضراء تشير إلى الأرباح';
    worksheet.getCell(row, 1).style = { font: { color: { argb: '059669' } } };
    row++;
    worksheet.getCell(row, 1).value = '• الأرقام الحمراء تشير إلى الخسائر';
    worksheet.getCell(row, 1).style = { font: { color: { argb: 'DC2626' } } };
  }

  private createMarketSheet(market: any) {
    const worksheet = this.workbook.addWorksheet('تحليل السوق');
    
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F2937' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    const dataStyle = {
      font: { size: 11 },
      alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    // Title
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'تحليل السوق والمنافسة';
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    let row = 3;

    // Market Overview
    worksheet.getCell(`A${row}`).value = 'نظرة عامة على السوق';
    worksheet.getCell(`A${row}`).style = headerStyle;
    worksheet.mergeCells(`A${row}:D${row}`);
    
    row++;
    if (market.marketSize) {
      this.addDataRow(worksheet, row++, 'حجم السوق', market.marketSize, headerStyle, dataStyle);
    }
    if (market.growthRate) {
      this.addDataRow(worksheet, row++, 'معدل النمو', market.growthRate, headerStyle, dataStyle);
    }
    if (market.targetMarket) {
      this.addDataRow(worksheet, row++, 'السوق المستهدف', market.targetMarket, headerStyle, dataStyle);
    }

    // Opportunities
    if (market.opportunities && market.opportunities.length > 0) {
      row++;
      worksheet.getCell(`A${row}`).value = 'الفرص';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:D${row}`);
      
      row++;
      market.opportunities.forEach((opp: string, index: number) => {
        worksheet.getCell(`A${row}`).value = `${index + 1}`;
        worksheet.getCell(`A${row}`).style = { ...headerStyle, alignment: { horizontal: 'center', vertical: 'middle' } };
        worksheet.getCell(`B${row}`).value = opp;
        worksheet.getCell(`B${row}`).style = dataStyle;
        worksheet.mergeCells(`B${row}:D${row}`);
        row++;
      });
    }

    // Threats
    if (market.threats && market.threats.length > 0) {
      row++;
      worksheet.getCell(`A${row}`).value = 'التهديدات';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:D${row}`);
      
      row++;
      market.threats.forEach((threat: string, index: number) => {
        worksheet.getCell(`A${row}`).value = `${index + 1}`;
        worksheet.getCell(`A${row}`).style = { ...headerStyle, alignment: { horizontal: 'center', vertical: 'middle' } };
        worksheet.getCell(`B${row}`).value = threat;
        worksheet.getCell(`B${row}`).style = dataStyle;
        worksheet.mergeCells(`B${row}:D${row}`);
        row++;
      });
    }

    // Competitors
    if (market.competitors && market.competitors.length > 0) {
      row++;
      worksheet.getCell(`A${row}`).value = 'تحليل المنافسين';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:D${row}`);
      
      row++;
      const competitorHeaders = ['اسم المنافس', 'الحصة السوقية', 'نقاط القوة', 'نقاط الضعف'];
      competitorHeaders.forEach((header, index) => {
        worksheet.getCell(row, index + 1).value = header;
        worksheet.getCell(row, index + 1).style = headerStyle;
      });

      row++;
      market.competitors.forEach((comp: any) => {
        worksheet.getCell(row, 1).value = comp.name;
        worksheet.getCell(row, 1).style = dataStyle;
        
        worksheet.getCell(row, 2).value = comp.marketShare || '';
        worksheet.getCell(row, 2).style = dataStyle;
        
        worksheet.getCell(row, 3).value = comp.strengths?.join(', ') || '';
        worksheet.getCell(row, 3).style = dataStyle;
        
        worksheet.getCell(row, 4).value = comp.weaknesses?.join(', ') || '';
        worksheet.getCell(row, 4).style = dataStyle;
        
        row++;
      });
    }

    // Adjust column widths
    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('D').width = 30;
  }

  private createRiskSheet(risk: any) {
    const worksheet = this.workbook.addWorksheet('تقييم المخاطر');
    
    const headerStyle = {
      font: { bold: true, size: 12, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F2937' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    const dataStyle = {
      font: { size: 11 },
      alignment: { horizontal: 'right', vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    } as Partial<XLSX.Style>;

    // Title
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'تقييم وتحليل المخاطر';
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16 },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    let row = 3;

    // Overall Risk Rating
    if (risk.overallRiskRating) {
      worksheet.getCell(`A${row}`).value = 'التقييم العام للمخاطر';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.getCell(`B${row}`).value = risk.overallRiskRating;
      worksheet.getCell(`B${row}`).style = { ...dataStyle, font: { ...dataStyle.font, bold: true, size: 14 } };
      worksheet.mergeCells(`B${row}:E${row}`);
      row += 2;
    }

    // Risk Details Table
    if (risk.risks && risk.risks.length > 0) {
      worksheet.getCell(`A${row}`).value = 'تفاصيل المخاطر';
      worksheet.getCell(`A${row}`).style = headerStyle;
      worksheet.mergeCells(`A${row}:E${row}`);
      
      row++;
      const riskHeaders = ['الفئة', 'الوصف', 'الاحتمالية', 'التأثير', 'استراتيجية التخفيف'];
      riskHeaders.forEach((header, index) => {
        worksheet.getCell(row, index + 1).value = header;
        worksheet.getCell(row, index + 1).style = headerStyle;
      });

      row++;
      risk.risks.forEach((r: any) => {
        const probabilityText = r.probability === 'high' ? 'عالي' : r.probability === 'medium' ? 'متوسط' : 'منخفض';
        const impactText = r.impact === 'high' ? 'عالي' : r.impact === 'medium' ? 'متوسط' : 'منخفض';
        
        worksheet.getCell(row, 1).value = r.category;
        worksheet.getCell(row, 1).style = dataStyle;
        
        worksheet.getCell(row, 2).value = r.description;
        worksheet.getCell(row, 2).style = dataStyle;
        
        worksheet.getCell(row, 3).value = probabilityText;
        worksheet.getCell(row, 3).style = {
          ...dataStyle,
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: r.probability === 'high' ? 'FEE2E2' : r.probability === 'medium' ? 'FEF3C7' : 'DCFCE7' }
          }
        };
        
        worksheet.getCell(row, 4).value = impactText;
        worksheet.getCell(row, 4).style = {
          ...dataStyle,
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: r.impact === 'high' ? 'FEE2E2' : r.impact === 'medium' ? 'FEF3C7' : 'DCFCE7' }
          }
        };
        
        worksheet.getCell(row, 5).value = r.mitigation;
        worksheet.getCell(row, 5).style = dataStyle;
        
        row++;
      });
    }

    // Risk Legend
    row += 2;
    worksheet.getCell(`A${row}`).value = 'مفتاح الألوان:';
    worksheet.getCell(`A${row}`).style = { font: { bold: true, size: 12 } };
    
    row++;
    worksheet.getCell(`A${row}`).value = '■ عالي';
    worksheet.getCell(`A${row}`).style = { font: { color: { argb: 'DC2626' } } };
    worksheet.getCell(`B${row}`).value = '■ متوسط';
    worksheet.getCell(`B${row}`).style = { font: { color: { argb: 'D97706' } } };
    worksheet.getCell(`C${row}`).value = '■ منخفض';
    worksheet.getCell(`C${row}`).style = { font: { color: { argb: '059669' } } };

    // Adjust column widths
    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 35;
    worksheet.getColumn('C').width = 12;
    worksheet.getColumn('D').width = 12;
    worksheet.getColumn('E').width = 35;
  }

  private addDataRow(worksheet: XLSX.Worksheet, row: number, label: string, value: string, headerStyle: Partial<XLSX.Style>, dataStyle: Partial<XLSX.Style>) {
    worksheet.getCell(`A${row}`).value = label;
    worksheet.getCell(`A${row}`).style = { ...headerStyle, alignment: { horizontal: 'right', vertical: 'middle' } };
    
    worksheet.getCell(`B${row}`).value = value;
    worksheet.getCell(`B${row}`).style = dataStyle;
    worksheet.mergeCells(`B${row}:D${row}`);
  }
}
