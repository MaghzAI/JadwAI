'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Bot, 
  Check, 
  X, 
  Settings, 
  Zap,
  Brain,
  Cloud,
  Server,
  Cpu
} from 'lucide-react';
import { aiManager, AIProviderType } from '@/lib/ai/AIManager';

interface AIProviderInfo {
  type: AIProviderType;
  name: string;
  displayName: string;
  available: boolean;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

export function AIProviderSelector({ 
  onProviderChange,
  currentProvider,
  disabled = false 
}: {
  onProviderChange: (provider: AIProviderType, settings: AISettings) => void;
  currentProvider?: AIProviderType;
  disabled?: boolean;
}) {
  const [providers, setProviders] = useState<AIProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>(currentProvider || 'gemini');
  const [settings, setSettings] = useState<AISettings>({
    temperature: 0.7,
    maxTokens: 2000,
    model: ''
  });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      loadModels(selectedProvider);
    }
  }, [selectedProvider]);

  const loadProviders = async () => {
    const availableProviders = aiManager.getAvailableProviders();
    
    const providerInfo: AIProviderInfo[] = availableProviders.map(provider => ({
      type: provider.type,
      name: provider.name,
      displayName: provider.displayName,
      available: provider.available,
      icon: getProviderIcon(provider.type),
      description: getProviderDescription(provider.type),
      features: getProviderFeatures(provider.type)
    }));

    setProviders(providerInfo);
  };

  const loadModels = async (provider: AIProviderType) => {
    try {
      const models = await aiManager.getProviderModels(provider);
      setAvailableModels(models);
      if (models.length > 0 && !settings.model) {
        setSettings(prev => ({ ...prev, model: models[0] }));
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      setAvailableModels([]);
    }
  };

  const testProvider = async (provider: AIProviderType) => {
    setTesting(prev => ({ ...prev, [provider]: true }));
    
    try {
      const result = await aiManager.testProvider(provider);
      // Visual feedback would be handled by parent component
      console.log(`Provider ${provider} test result:`, result);
    } catch (error) {
      console.error(`Failed to test ${provider}:`, error);
    } finally {
      setTesting(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleProviderSelect = (provider: AIProviderType) => {
    setSelectedProvider(provider);
    onProviderChange(provider, settings);
  };

  const handleSettingsChange = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onProviderChange(selectedProvider, updatedSettings);
  };

  const getProviderIcon = (type: AIProviderType): React.ReactNode => {
    const iconMap = {
      gemini: <Brain className="h-5 w-5 text-blue-600" />,
      openai: <Zap className="h-5 w-5 text-green-600" />,
      claude: <Bot className="h-5 w-5 text-orange-600" />,
      openrouter: <Cloud className="h-5 w-5 text-purple-600" />,
      ollama: <Server className="h-5 w-5 text-gray-600" />
    };
    return iconMap[type];
  };

  const getProviderDescription = (type: AIProviderType): string => {
    const descriptions = {
      gemini: 'Google Gemini - نموذج متقدم للنصوص والصور',
      openai: 'OpenAI GPT-4 - نموذج قوي ومتعدد الاستخدامات',
      claude: 'Anthropic Claude - نموذج آمن ومفيد',
      openrouter: 'OpenRouter - وصول لنماذج متعددة',
      ollama: 'Ollama - نماذج محلية للخصوصية التامة'
    };
    return descriptions[type];
  };

  const getProviderFeatures = (type: AIProviderType): string[] => {
    const features = {
      gemini: ['دعم النصوص والصور', 'سريع', 'مجاني جزئياً'],
      openai: ['قوي جداً', 'متنوع', 'دقيق'],
      claude: ['آمن', 'مفيد', 'أخلاقي'],
      openrouter: ['نماذج متعددة', 'مرن', 'قابل للتخصيص'],
      ollama: ['محلي', 'خصوصية كاملة', 'لا يتطلب إنترنت']
    };
    return features[type] || [];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات مقدم الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.type}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProvider === provider.type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!provider.available ? 'opacity-50' : ''} ${disabled ? 'pointer-events-none' : ''}`}
                onClick={() => provider.available && !disabled && handleProviderSelect(provider.type)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {provider.icon}
                    <h3 className="font-medium">{provider.displayName}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {provider.available ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {selectedProvider === provider.type && (
                      <Badge variant="default" className="text-xs">مُختار</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {provider.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                {provider.available && !disabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      testProvider(provider.type);
                    }}
                    disabled={testing[provider.type]}
                    className="w-full"
                  >
                    {testing[provider.type] ? 'جاري الاختبار...' : 'اختبار الاتصال'}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* AI Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">إعدادات التوليد</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model Selection */}
              {availableModels.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="model-select">النموذج</Label>
                  <Select
                    value={settings.model}
                    onValueChange={(value) => handleSettingsChange({ model: value })}
                    disabled={disabled}
                  >
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="اختر النموذج" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature">درجة الإبداع: {settings.temperature}</Label>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[settings.temperature]}
                  onValueChange={([value]) => handleSettingsChange({ temperature: value })}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>محافظ (0)</span>
                  <span>متوازن (1)</span>
                  <span>إبداعي (2)</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <Label htmlFor="max-tokens">الحد الأقصى للكلمات: {settings.maxTokens}</Label>
                <Slider
                  id="max-tokens"
                  min={100}
                  max={4000}
                  step={100}
                  value={[settings.maxTokens]}
                  onValueChange={([value]) => handleSettingsChange({ maxTokens: value })}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>قصير (100)</span>
                  <span>متوسط (2000)</span>
                  <span>طويل (4000)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AISettings {
  temperature: number;
  maxTokens: number;
  model: string;
}
