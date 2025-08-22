import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'إنشاء حساب - منصة دراسات الجدوى',
  description: 'قم بإنشاء حساب جديد في منصة دراسات الجدوى الذكية',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <SignUpForm />
    </div>
  );
}
