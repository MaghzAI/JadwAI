'use client';

import { useEffect, useState } from 'react';
import { useStudyWizard } from '@/contexts/StudyWizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Users, Target, Building, BarChart3, Plus, Trash2, Sparkles } from 'lucide-react';
import { ContentGenerator } from '@/components/ai/ContentGenerator';

const MARKET_SIZES = [
  { value: 'niche', label: 'سوق متخصص (<1 مليون)' },
  { value: 'small', label: 'سوق صغير (1-10 مليون)' },
  { value: 'medium', label: 'سوق متوسط (10-100 مليون)' },
  { value: 'large', label: 'سوق كبير (100 مليون - 1 مليار)' },
  { value: 'massive', label: 'سوق ضخم (>1 مليار)' },
];

const GROWTH_RATES = [
  { value: 'declining', label: 'متراجع (<0%)' },
  { value: 'stable', label: 'مستقر (0-2%)' },
  { value: 'slow', label: 'نمو بطيء (2-5%)' },
  { value: 'moderate', label: 'نمو متوسط (5-10%)' },
  { value: 'fast', label: 'نمو سريع (10-25%)' },
  { value: 'explosive', label: 'نمو انفجاري (>25%)' },
];

interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
}

interface CustomerSegment {
  name: string;
  size: string;
  characteristics: string;
  needs: string;
  priority: number;
}

export default function MarketAnalysisStep() {
  const { state, updateData, updateStepStatus, setError, clearError } = useStudyWizard();
  const [formData, setFormData] = useState({
    marketSize: '',
    growthRate: '',
    marketTrends: '',
    targetSegments: [] as CustomerSegment[],
    competitors: [] as Competitor[],
    marketBarriers: '',
    marketOpportunities: '',
    seasonality: '',
    regulatoryEnvironment: '',
    distributionChannels: '',
    pricingStrategy: '',
    marketPenetrationStrategy: '',
  });

  const [newSegment, setNewSegment] = useState<CustomerSegment>({
    name: '',
    size: '',
    characteristics: '',
    needs: '',
    priority: 3,
  });

  const [newCompetitor, setNewCompetitor] = useState<Competitor>({
    name: '',
    marketShare: 0,
    strengths: [],
    weaknesses: [],
    pricing: '',
  });

  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  // تحميل البيانات من الحالة
  useEffect(() => {
    const existingData = state.data.marketAnalysis;
    if (existingData) {
      setFormData({
        marketSize: existingData.marketSize || '',
        growthRate: existingData.growthRate || '',
        marketTrends: existingData.marketTrends || '',
        targetSegments: existingData.targetSegments || [],
        competitors: existingData.competitors || [],
        marketBarriers: existingData.marketBarriers || '',
        marketOpportunities: existingData.marketOpportunities || '',
        seasonality: existingData.seasonality || '',
        regulatoryEnvironment: existingData.regulatoryEnvironment || '',
        distributionChannels: existingData.distributionChannels || '',
        pricingStrategy: existingData.pricingStrategy || '',
        marketPenetrationStrategy: existingData.marketPenetrationStrategy || '',
      });
    }
  }, [state.data.marketAnalysis]);

  // تحديث البيانات والتحقق من الصحة
  useEffect(() => {
    const isValid = validateForm();
    const isCompleted = isValid && formData.targetSegments.length > 0 && formData.competitors.length > 0;
    
    updateData({
      marketAnalysis: formData,
    });
    
    updateStepStatus(1, isCompleted, isValid);
  }, [formData, updateData, updateStepStatus]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.marketSize) {
      errors.push('حجم السوق مطلوب');
    }

    if (!formData.growthRate) {
      errors.push('معدل نمو السوق مطلوب');
    }

    if (!formData.marketTrends.trim()) {
      errors.push('اتجاهات السوق مطلوبة');
    }

    if (formData.targetSegments.length === 0) {
      errors.push('يجب إضافة قطاع عملاء واحد على الأقل');
    }

    if (formData.competitors.length === 0) {
      errors.push('يجب إضافة منافس واحد على الأقل');
    }

    if (errors.length > 0) {
      setError('marketAnalysis', errors.join('، '));
      return false;
    } else {
      clearError('marketAnalysis');
      return true;
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // إدارة قطاعات العملاء
  const addCustomerSegment = () => {
    if (newSegment.name.trim() && newSegment.characteristics.trim()) {
      setFormData(prev => ({
        ...prev,
        targetSegments: [...prev.targetSegments, { ...newSegment }],
      }));
      setNewSegment({
        name: '',
        size: '',
        characteristics: '',
        needs: '',
        priority: 3,
      });
    }
  };

  const removeCustomerSegment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetSegments: prev.targetSegments.filter((_, i) => i !== index),
    }));
  };

  const handleAIContentGenerated = (aiContent: any) => {
    if (typeof aiContent === 'object' && aiContent !== null) {
      setFormData(prev => ({
        ...prev,
        marketSize: aiContent.marketSize || prev.marketSize,
        growthRate: aiContent.growthRate || prev.growthRate,
        keyTrends: Array.isArray(aiContent.keyTrends) ? aiContent.keyTrends : prev.keyTrends,
        marketOpportunities: Array.isArray(aiContent.opportunities) ? 
          aiContent.opportunities.join('\n• ') : prev.marketOpportunities,
        marketThreats: Array.isArray(aiContent.challenges) ? 
          aiContent.challenges.join('\n• ') : prev.marketThreats
      }));
    }
  };

  // إدارة المنافسين
  const addCompetitor = () => {
    if (newCompetitor.name.trim()) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, { ...newCompetitor }],
      }));
      setNewCompetitor({
        name: '',
        marketShare: 0,
        strengths: [],
        weaknesses: [],
        pricing: '',
      });
    }
  };

  const removeCompetitor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index),
    }));
  };

  const addStrengthToCompetitor = () => {
    if (newStrength.trim()) {
      setNewCompetitor(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()],
      }));
      setNewStrength('');
    }
  };

  const addWeaknessToCompetitor = () => {
    if (newWeakness.trim()) {
      setNewCompetitor(prev => ({
        ...prev,
        weaknesses: [...prev.weaknesses, newWeakness.trim()],
      }));
      setNewWeakness('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
          <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          تحليل السوق
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ادرس السوق المستهدف والمنافسين والفرص المتاحة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              نظرة عامة على السوق
            </CardTitle>
            <CardDescription>
              خصائص السوق الأساسية
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="marketSize">حجم السوق *</Label>
              <Select
                value={formData.marketSize}
                onValueChange={(value) => handleInputChange('marketSize', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر حجم السوق" />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="growthRate">معدل نمو السوق *</Label>
              <Select
                value={formData.growthRate}
                onValueChange={(value) => handleInputChange('growthRate', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="اختر معدل النمو" />
                </SelectTrigger>
                <SelectContent>
                  {GROWTH_RATES.map((rate) => (
                    <SelectItem key={rate.value} value={rate.value}>
                      {rate.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seasonality">الموسمية</Label>
              <Input
                id="seasonality"
                value={formData.seasonality}
                onChange={(e) => handleInputChange('seasonality', e.target.value)}
                placeholder="مثال: ذروة في الصيف، انخفاض في الشتاء"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Distribution & Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              استراتيجية السوق
            </CardTitle>
            <CardDescription>
              كيف ستدخل السوق وتنافس
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="distributionChannels">قنوات التوزيع</Label>
              <Textarea
                id="distributionChannels"
                value={formData.distributionChannels}
                onChange={(e) => handleInputChange('distributionChannels', e.target.value)}
                placeholder="مثال: متاجر إلكترونية، وكلاء، بيع مباشر..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="pricingStrategy">استراتيجية التسعير</Label>
              <Textarea
                id="pricingStrategy"
                value={formData.pricingStrategy}
                onChange={(e) => handleInputChange('pricingStrategy', e.target.value)}
                placeholder="مثال: تسعير تنافسي، قيمة مضافة، اختراق السوق..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاهات السوق *</CardTitle>
          <CardDescription>
            ما هي الاتجاهات والتطورات الحالية في السوق؟
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.marketTrends}
            onChange={(e) => handleInputChange('marketTrends', e.target.value)}
            placeholder="صف الاتجاهات الحالية: التقنيات الناشئة، تغيير سلوك المستهلكين، قوانين جديدة..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            قطاعات العملاء المستهدفة *
          </CardTitle>
          <CardDescription>
            حدد القطاعات المختلفة من عملائك المحتملين
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Segment */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">إضافة قطاع جديد</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="segmentName">اسم القطاع</Label>
                <Input
                  id="segmentName"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: الشباب التقني"
                />
              </div>
              <div>
                <Label htmlFor="segmentSize">حجم القطاع</Label>
                <Input
                  id="segmentSize"
                  value={newSegment.size}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, size: e.target.value }))}
                  placeholder="مثال: 100,000 شخص"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="segmentCharacteristics">خصائص القطاع</Label>
              <Textarea
                id="segmentCharacteristics"
                value={newSegment.characteristics}
                onChange={(e) => setNewSegment(prev => ({ ...prev, characteristics: e.target.value }))}
                placeholder="العمر، الدخل، الاهتمامات، السلوك..."
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="segmentNeeds">احتياجات القطاع</Label>
              <Textarea
                id="segmentNeeds"
                value={newSegment.needs}
                onChange={(e) => setNewSegment(prev => ({ ...prev, needs: e.target.value }))}
                placeholder="ما هي احتياجاتهم ومشاكلهم التي يحلها منتجك؟"
                className="min-h-[60px]"
              />
            </div>
            <div>
              <Label htmlFor="segmentPriority">الأولوية (1-5)</Label>
              <Slider
                value={[newSegment.priority]}
                onValueChange={(value) => setNewSegment(prev => ({ ...prev, priority: value[0] }))}
                max={5}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-gray-500 mt-1">
                الأولوية: {newSegment.priority}/5
              </div>
            </div>
            <Button onClick={addCustomerSegment} className="w-full" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إضافة القطاع
            </Button>
          </div>

          {/* Existing Segments */}
          {formData.targetSegments.map((segment, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {segment.name}
                  </h4>
                  <p className="text-sm text-gray-500">حجم القطاع: {segment.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={segment.priority >= 4 ? 'default' : segment.priority >= 3 ? 'secondary' : 'outline'}>
                    أولوية {segment.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomerSegment(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">خصائص:</span> {segment.characteristics}
                </div>
                <div>
                  <span className="font-medium">احتياجات:</span> {segment.needs}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Competitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            المنافسون *
          </CardTitle>
          <CardDescription>
            حلل منافسيك الرئيسيين في السوق
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Competitor */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">إضافة منافس جديد</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="competitorName">اسم المنافس</Label>
                <Input
                  id="competitorName"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: شركة ABC"
                />
              </div>
              <div>
                <Label htmlFor="competitorPricing">استراتيجية التسعير</Label>
                <Input
                  id="competitorPricing"
                  value={newCompetitor.pricing}
                  onChange={(e) => setNewCompetitor(prev => ({ ...prev, pricing: e.target.value }))}
                  placeholder="مثال: متوسط السعر، مرتفع"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="marketShare">الحصة السوقية (%)</Label>
              <Slider
                value={[newCompetitor.marketShare]}
                onValueChange={(value) => setNewCompetitor(prev => ({ ...prev, marketShare: value[0] }))}
                max={50}
                min={0}
                step={1}
                className="mt-2"
              />
              <div className="text-sm text-gray-500 mt-1">
                الحصة السوقية: {newCompetitor.marketShare}%
              </div>
            </div>
            
            {/* Strengths */}
            <div>
              <Label>نقاط القوة</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="أضف نقطة قوة..."
                  onKeyPress={(e) => e.key === 'Enter' && addStrengthToCompetitor()}
                />
                <Button onClick={addStrengthToCompetitor} variant="outline" size="sm">
                  إضافة
                </Button>
              </div>
              {newCompetitor.strengths.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newCompetitor.strengths.map((strength, idx) => (
                    <Badge key={idx} variant="secondary" className="text-green-700 bg-green-100">
                      {strength}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Weaknesses */}
            <div>
              <Label>نقاط الضعف</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newWeakness}
                  onChange={(e) => setNewWeakness(e.target.value)}
                  placeholder="أضف نقطة ضعف..."
                  onKeyPress={(e) => e.key === 'Enter' && addWeaknessToCompetitor()}
                />
                <Button onClick={addWeaknessToCompetitor} variant="outline" size="sm">
                  إضافة
                </Button>
              </div>
              {newCompetitor.weaknesses.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newCompetitor.weaknesses.map((weakness, idx) => (
                    <Badge key={idx} variant="outline" className="text-red-700 border-red-300">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={addCompetitor} className="w-full" variant="outline">
              <Plus className="h-4 w-4 ml-2" />
              إضافة المنافس
            </Button>
          </div>

          {/* Existing Competitors */}
          {formData.competitors.map((competitor, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {competitor.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    حصة سوقية: {competitor.marketShare}% • {competitor.pricing}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCompetitor(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">نقاط القوة:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competitor.strengths.map((strength, idx) => (
                      <Badge key={idx} variant="secondary" className="text-green-700 bg-green-100">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-red-700">نقاط الضعف:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <Badge key={idx} variant="outline" className="text-red-700 border-red-300">
                        {weakness}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>حواجز دخول السوق</CardTitle>
            <CardDescription>
              ما هي العقبات التي قد تواجهها؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.marketBarriers}
              onChange={(e) => handleInputChange('marketBarriers', e.target.value)}
              placeholder="مثال: رأس مال كبير، تراخيص، تقنية معقدة، علاقات قوية مع الموردين..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الفرص المتاحة</CardTitle>
            <CardDescription>
              ما هي الفرص التي يمكنك استغلالها؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.marketOpportunities}
              onChange={(e) => handleInputChange('marketOpportunities', e.target.value)}
              placeholder="مثال: تقنيات جديدة، تغيير في القوانين، فجوة في السوق..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Environment & Market Penetration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>البيئة التنظيمية</CardTitle>
            <CardDescription>
              القوانين واللوائح المؤثرة على السوق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.regulatoryEnvironment}
              onChange={(e) => handleInputChange('regulatoryEnvironment', e.target.value)}
              placeholder="مثال: تراخيص مطلوبة، معايير جودة، ضرائب خاصة..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>استراتيجية اختراق السوق</CardTitle>
            <CardDescription>
              كيف ستحصل على حصتك من السوق؟
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.marketPenetrationStrategy}
              onChange={(e) => handleInputChange('marketPenetrationStrategy', e.target.value)}
              placeholder="مثال: تسعير تنافسي، شراكات استراتيجية، حملات تسويقية مكثفة..."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* AI Content Generator */}
      <ContentGenerator 
        type="market_analysis"
        projectData={{
          marketSize: formData.marketSize,
          growthRate: formData.growthRate,
          keyTrends: formData.keyTrends,
          targetMarket: state.data.executiveSummary?.targetMarket || ''
        }}
        onContentGenerated={handleAIContentGenerated}
        className="border-2 border-dashed border-green-200 dark:border-green-800"
      />
    </div>
  );
}
