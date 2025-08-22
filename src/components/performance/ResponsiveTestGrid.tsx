'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, Wifi, Zap, Eye } from 'lucide-react';

interface DeviceSpec {
  name: string;
  icon: React.ComponentType<any>;
  minWidth: number;
  maxWidth?: number;
  description: string;
}

const deviceSpecs: DeviceSpec[] = [
  {
    name: 'الهاتف المحمول',
    icon: Smartphone,
    minWidth: 320,
    maxWidth: 768,
    description: 'أجهزة الهواتف الذكية والشاشات الصغيرة'
  },
  {
    name: 'الجهاز اللوحي',
    icon: Tablet,
    minWidth: 769,
    maxWidth: 1024,
    description: 'الأجهزة اللوحية والشاشات المتوسطة'
  },
  {
    name: 'سطح المكتب',
    icon: Monitor,
    minWidth: 1025,
    description: 'أجهزة الكمبيوتر المكتبية والشاشات الكبيرة'
  }
];

export default function ResponsiveTestGrid() {
  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentDevice, setCurrentDevice] = useState<DeviceSpec | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const updateWidth = () => {
      setCurrentWidth(window.innerWidth);
    };

    const measurePerformance = () => {
      // قياس الأداء الأساسي
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      // قياس استخدام الذاكرة (إذا كان متاحاً)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0;

      setPerformanceMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(performance.now()),
        memoryUsage: Math.round(memoryUsage * 100) / 100
      });
    };

    updateWidth();
    measurePerformance();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const device = deviceSpecs.find(spec => 
      currentWidth >= spec.minWidth && 
      (!spec.maxWidth || currentWidth <= spec.maxWidth)
    );
    setCurrentDevice(device || null);
  }, [currentWidth]);

  const getPerformanceStatus = (metric: number, type: 'load' | 'memory') => {
    if (type === 'load') {
      if (metric < 100) return { label: 'ممتاز', color: 'bg-green-500' };
      if (metric < 300) return { label: 'جيد', color: 'bg-yellow-500' };
      return { label: 'بطيء', color: 'bg-red-500' };
    } else {
      if (metric < 20) return { label: 'منخفض', color: 'bg-green-500' };
      if (metric < 50) return { label: 'متوسط', color: 'bg-yellow-500' };
      return { label: 'مرتفع', color: 'bg-red-500' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">اختبار الأداء والاستجابة</h2>
        <p className="text-gray-600 dark:text-gray-400">
          فحص شامل لأداء التطبيق على أجهزة مختلفة
        </p>
      </div>

      {/* معلومات الجهاز الحالي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentDevice && <currentDevice.icon className="h-5 w-5" />}
            الجهاز الحالي
          </CardTitle>
          <CardDescription>
            عرض الشاشة: {currentWidth}px
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentDevice ? (
            <div className="space-y-2">
              <Badge variant="secondary" className="text-sm">
                {currentDevice.name}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentDevice.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">غير محدد</p>
          )}
        </CardContent>
      </Card>

      {/* مقاييس الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              زمن التحميل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{performanceMetrics.loadTime}ms</span>
              <Badge 
                variant="secondary" 
                className={`${getPerformanceStatus(performanceMetrics.loadTime, 'load').color} text-white`}
              >
                {getPerformanceStatus(performanceMetrics.loadTime, 'load').label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              زمن العرض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{performanceMetrics.renderTime}ms</span>
              <Badge variant="secondary">قياس</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              استخدام الذاكرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{performanceMetrics.memoryUsage}MB</span>
              <Badge 
                variant="secondary"
                className={`${getPerformanceStatus(performanceMetrics.memoryUsage, 'memory').color} text-white`}
              >
                {getPerformanceStatus(performanceMetrics.memoryUsage, 'memory').label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* اختبار الاستجابة لكل جهاز */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">اختبار التوافق مع الأجهزة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deviceSpecs.map((device) => {
            const Icon = device.icon;
            const isActive = currentDevice?.name === device.name;
            
            return (
              <Card key={device.name} className={isActive ? 'ring-2 ring-blue-500' : ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {device.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {device.minWidth}px - {device.maxWidth ? `${device.maxWidth}px` : 'أعلى'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {device.description}
                    </p>
                    <Badge 
                      variant={isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {isActive ? 'نشط حالياً' : 'غير نشط'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* توصيات التحسين */}
      <Card>
        <CardHeader>
          <CardTitle>توصيات التحسين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>تصميم متجاوب يدعم جميع أحجام الشاشات</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>تحميل كسول للمكونات الثقيلة</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>تحسينات خاصة للأجهزة المحمولة</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>دعم الشاشات عالية الدقة</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
