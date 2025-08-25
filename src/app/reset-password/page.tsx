'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenPresent, setTokenPresent] = useState(true);

  // Supabase يرسل رمز الاستعادة ضمن هاش URL
  // إذا وصل المستخدم لهذه الصفحة بدون الهاش، نحذّره
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // وجود access_token أو type=recovery ضمن الهاش يدل على قدومه من الرابط الصحيح
      const hash = window.location.hash || '';
      const hasRecovery = hash.includes('access_token=') || hash.includes('type=recovery');
      setTokenPresent(hasRecovery);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) {
      toast({ title: 'تنبيه', description: 'يرجى إدخال كلمة المرور وتأكيدها', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'عدم تطابق', description: 'كلمتا المرور غير متطابقتين', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: 'تم التحديث', description: 'تم تعيين كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.' });
      router.replace('/auth/signin');
    } catch (err: any) {
      toast({ title: 'خطأ', description: err?.message || 'تعذر تحديث كلمة المرور، حاول لاحقاً', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">تعيين كلمة مرور جديدة</h1>
        {!tokenPresent && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center">
            لم يتم العثور على رمز الاستعادة. يرجى استخدام الرابط الوارد في بريدك الإلكتروني للوصول إلى هذه الصفحة.
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">كلمة المرور الجديدة</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !tokenPresent}>
            {loading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور'}
          </Button>
        </form>
      </div>
    </div>
  );
}
