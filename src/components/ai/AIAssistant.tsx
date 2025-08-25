'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Send, 
  Minimize2, 
  Maximize2, 
  Sparkles,
  Loader2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: Array<{
    type: 'executive_summary' | 'market_analysis' | 'risk_assessment' | 'recommendations';
    title: string;
    description: string;
  }>;
}

interface AIAssistantProps {
  currentStep?: string;
  studyData?: any;
  onSuggestionApply?: (type: string, data: any) => void;
}

export function AIAssistant({ currentStep, studyData, onSuggestionApply }: AIAssistantProps) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي في إعداد دراسة الجدوى. يمكنني مساعدتك في توليد المحتوى، تحليل البيانات، وتقديم اقتراحات مفيدة. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
      suggestions: [
        {
          type: 'executive_summary',
          title: 'توليد الملخص التنفيذي',
          description: 'إنشاء ملخص تنفيذي شامل بناءً على بيانات مشروعك'
        },
        {
          type: 'market_analysis', 
          title: 'تحليل السوق',
          description: 'تحليل مفصل للسوق والفرص والتحديات'
        },
        {
          type: 'risk_assessment',
          title: 'تقييم المخاطر',
          description: 'تحديد وتقييم المخاطر المحتملة مع استراتيجيات التخفيف'
        }
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // إضافة رسائل مخصصة حسب الخطوة الحالية
    if (currentStep && messages.length === 1) {
      const stepMessages: Record<string, string> = {
        executive_summary: 'أرى أنك في خطوة الملخص التنفيذي. يمكنني مساعدتك في إنشاء ملخص شامل ومقنع لمشروعك.',
        market_analysis: 'أنت الآن في مرحلة تحليل السوق. يمكنني تحليل السوق وتقديم رؤى عن الفرص والتحديات.',
        financial_analysis: 'مرحلة التحليل المالي مهمة جداً. يمكنني مساعدتك في تقييم الجدوى المالية وحساب المؤشرات.',
        technical_analysis: 'في التحليل التقني، يمكنني مساعدتك في تحديد المتطلبات التقنية والتقنيات المناسبة.',
        risk_assessment: 'تقييم المخاطر خطوة حاسمة. دعني أساعدك في تحديد المخاطر وإعداد استراتيجيات التخفيف.',
        review: 'مرحلة المراجعة النهائية! يمكنني مراجعة دراستك وتقديم توصيات شاملة.'
      };

      if (stepMessages[currentStep]) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: stepMessages[currentStep],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }
  }, [currentStep]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    // محاكاة استجابة المساعد الذكي
    setTimeout(() => {
      const responses = [
        'فكرة ممتازة! بناءً على البيانات المتوفرة، أقترح التركيز على النقاط التالية...',
        'هذا تساؤل مهم. دعني أحلل البيانات وأقدم لك اقتراحات مفيدة...',
        'يمكنني مساعدتك في هذا الأمر. إليك بعض التوجيهات المبنية على أفضل الممارسات...',
        'بناءً على تحليل مشروعك، أرى فرصاً واعدة في هذا المجال...'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = async (suggestion: NonNullable<Message['suggestions']>[0]) => {
    if (!suggestion) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: suggestion.type,
          data: studyData || {}
        })
      });

      const result = await response.json();

      if (result.success) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `تم توليد ${suggestion.title} بنجاح! يمكنك مراجعة المحتوى المولد وتطبيقه على دراستك.`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // تطبيق الاقتراح إذا كانت الوظيفة متوفرة
        if (onSuggestionApply) {
          onSuggestionApply(suggestion.type, result.data);
        }
      } else {
        throw new Error(result.error || 'فشل في توليد المحتوى');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `عذراً، حدث خطأ أثناء توليد المحتوى: ${error instanceof Error ? error.message : 'خطأ غير معروف'}. سأستخدم نماذج افتراضية بدلاً من ذلك.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'executive_summary': return FileText;
      case 'market_analysis': return TrendingUp;
      case 'risk_assessment': return AlertTriangle;
      case 'recommendations': return Lightbulb;
      default: return Sparkles;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          <Bot className="h-6 w-6" />
        </Button>
        {isLoading && (
          <div className="absolute -top-2 -right-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent bg-white"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 h-[500px]">
      <Card className="h-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">المساعد الذكي</CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                AI
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* عرض الاقتراحات */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => {
                          const IconComponent = getSuggestionIcon(suggestion.type);
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              disabled={isLoading}
                              className="w-full justify-start text-right h-auto p-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <IconComponent className="h-4 w-4 text-blue-600" />
                                <div className="text-right flex-1">
                                  <div className="font-medium text-sm">{suggestion.title}</div>
                                  <div className="text-xs text-gray-600">{suggestion.description}</div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                      <span className="text-sm text-gray-600">المساعد يفكر...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* إدخال الرسائل */}
          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 text-right"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
