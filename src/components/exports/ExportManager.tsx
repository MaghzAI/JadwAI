'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FileSpreadsheet, 
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileImage
} from 'lucide-react';
import { PDFGenerator, StudyData } from '@/lib/exports/pdf-generator';
import { WordGenerator } from '@/lib/exports/word-generator';
import { ExcelGenerator } from '@/lib/exports/excel-generator';

interface ExportManagerProps {
  studyData: StudyData;
  disabled?: boolean;
}

type ExportFormat = 'pdf' | 'word' | 'excel';
type ExportStatus = 'idle' | 'generating' | 'success' | 'error';

interface ExportOption {
  format: ExportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  fileExtension: string;
  mimeType: string;
}

export function ExportManager({ studyData, disabled = false }: ExportManagerProps) {
  const [exportStatuses, setExportStatuses] = useState<Record<ExportFormat, ExportStatus>>({
    pdf: 'idle',
    word: 'idle',
    excel: 'idle'
  });
  const [downloadUrls, setDownloadUrls] = useState<Record<ExportFormat, string | null>>({
    pdf: null,
    word: null,
    excel: null
  });

  const exportOptions: ExportOption[] = [
    {
      format: 'pdf',
      name: 'تصدير PDF',
      description: 'مستند PDF احترافي مع تنسيق متقدم وجداول',
      icon: <FileText className="h-6 w-6" />,
      fileExtension: 'pdf',
      mimeType: 'application/pdf'
    },
    {
      format: 'word',
      name: 'تصدير Word',
      description: 'مستند Word قابل للتحرير مع التنسيق الكامل',
      icon: <FileImage className="h-6 w-6" />,
      fileExtension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
      format: 'excel',
      name: 'تصدير Excel',
      description: 'جداول Excel للبيانات المالية مع الرسوم البيانية',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      fileExtension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ];

  const handleExport = async (format: ExportFormat) => {
    setExportStatuses(prev => ({ ...prev, [format]: 'generating' }));
    
    try {
      let blob: Blob;
      let filename: string;

      switch (format) {
        case 'pdf':
          const pdfGenerator = new PDFGenerator();
          const pdfBuffer = pdfGenerator.generateStudyPDF(studyData);
          blob = new Blob([pdfBuffer], { type: 'application/pdf' });
          filename = `${studyData.title}_دراسة_جدوى.pdf`;
          break;

        case 'word':
          const wordGenerator = new WordGenerator();
          blob = await wordGenerator.generateStudyDocument(studyData);
          filename = `${studyData.title}_دراسة_جدوى.docx`;
          break;

        case 'excel':
          const excelGenerator = new ExcelGenerator();
          const excelBuffer = await excelGenerator.generateFinancialExcel(studyData);
          blob = new Blob([new Uint8Array(excelBuffer)], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          filename = `${studyData.title}_البيانات_المالية.xlsx`;
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Create download URL
      const url = URL.createObjectURL(blob);
      setDownloadUrls(prev => ({ ...prev, [format]: url }));
      
      // Start download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportStatuses(prev => ({ ...prev, [format]: 'success' }));
      
      // Clean up URL after 1 minute
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadUrls(prev => ({ ...prev, [format]: null }));
      }, 60000);

    } catch (error) {
      console.error(`Export error for ${format}:`, error);
      setExportStatuses(prev => ({ ...prev, [format]: 'error' }));
    }
  };

  const handleBulkExport = async () => {
    // Export all formats simultaneously
    const exportPromises = exportOptions.map(option => 
      handleExport(option.format)
    );

    await Promise.all(exportPromises);
  };

  const getStatusIcon = (status: ExportStatus) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: ExportStatus) => {
    switch (status) {
      case 'generating':
        return <Badge variant="secondary">جاري التصدير...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-600">تم بنجاح</Badge>;
      case 'error':
        return <Badge variant="destructive">فشل</Badge>;
      default:
        return null;
    }
  };

  const isGenerating = Object.values(exportStatuses).some(status => status === 'generating');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              تصدير دراسة الجدوى
            </div>
            <Button
              onClick={handleBulkExport}
              disabled={disabled || isGenerating}
              variant="outline"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  تصدير الكل
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exportOptions.map((option) => {
              const status = exportStatuses[option.format];
              const isExporting = status === 'generating';
              const hasSucceeded = status === 'success';
              const hasFailed = status === 'error';

              return (
                <Card 
                  key={option.format}
                  className={`transition-all duration-200 ${
                    hasSucceeded ? 'border-green-200 bg-green-50' : 
                    hasFailed ? 'border-red-200 bg-red-50' : 
                    'hover:border-gray-300'
                  } ${disabled ? 'opacity-50' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          hasSucceeded ? 'bg-green-100 text-green-700' :
                          hasFailed ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {option.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(status)}
                            {getStatusBadge(status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {option.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleExport(option.format)}
                        disabled={disabled || isExporting}
                        variant={hasSucceeded ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            جاري التصدير...
                          </>
                        ) : hasSucceeded ? (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            تصدير مرة أخرى
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            تصدير {option.fileExtension.toUpperCase()}
                          </>
                        )}
                      </Button>

                      {hasSucceeded && downloadUrls[option.format] && (
                        <a
                          href={downloadUrls[option.format]!}
                          download={`${studyData.title}.${option.fileExtension}`}
                          className="text-xs text-blue-600 hover:text-blue-800 text-center py-1"
                        >
                          تحميل مرة أخرى
                        </a>
                      )}

                      {hasFailed && (
                        <p className="text-xs text-red-600 text-center py-1">
                          فشل في التصدير. يرجى المحاولة مرة أخرى.
                        </p>
                      )}
                    </div>

                    {/* File info */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>النوع: {option.fileExtension.toUpperCase()}</span>
                        <span>الحجم المتوقع: ~2-5 MB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Export Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">نصائح التصدير:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• استخدم PDF للمشاركة والطباعة الاحترافية</li>
              <li>• استخدم Word للتحرير والتعديل على المحتوى</li>
              <li>• استخدم Excel لتحليل البيانات المالية والرسوم البيانية</li>
              <li>• يمكن تصدير جميع الأنواع دفعة واحدة باستخدام زر "تصدير الكل"</li>
            </ul>
          </div>

          {/* Data Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">محتوى الدراسة المُصدّرة:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${studyData.executiveSummary ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={studyData.executiveSummary ? 'text-gray-900' : 'text-gray-500'}>
                  الملخص التنفيذي
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${studyData.marketAnalysis ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={studyData.marketAnalysis ? 'text-gray-900' : 'text-gray-500'}>
                  تحليل السوق
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${studyData.financialAnalysis ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={studyData.financialAnalysis ? 'text-gray-900' : 'text-gray-500'}>
                  التحليل المالي
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${studyData.riskAssessment ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={studyData.riskAssessment ? 'text-gray-900' : 'text-gray-500'}>
                  تقييم المخاطر
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
