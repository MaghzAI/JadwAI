import { Metadata } from 'next';
import SignInForm from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'تسجيل الدخول - منصة دراسات الجدوى',
  description: 'قم بتسجيل الدخول إلى حسابك في منصة دراسات الجدوى الذكية',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <SignInForm />
    </div>
  );
}
