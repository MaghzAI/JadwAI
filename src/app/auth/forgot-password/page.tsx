'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAuth } from '@/lib/auth/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور',
  description: 'أدخل بريدك الإلكتروني لإرسال رابط استعادة كلمة المرور',
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: 'تنبيه', description: 'يرجى إدخال البريد الإلكتروني', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabaseAuth.resetPassword(email);
      if (error) throw error;
      toast({
        title: 'تم الإرسال',
        description: 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني إن كان مسجلاً لدينا.',
      });
    } catch (err: any) {
      toast({ title: 'خطأ', description: err?.message || 'تعذر إرسال الرابط، حاول لاحقاً', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">استعادة كلمة المرور</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جارٍ الإرسال...' : 'إرسال رابط الاستعادة'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
