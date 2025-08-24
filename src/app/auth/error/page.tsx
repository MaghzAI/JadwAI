import { Metadata } from 'next'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'خطأ في تسجيل الدخول - منصة دراسات الجدوى',
  description: 'حدث خطأ أثناء عملية تسجيل الدخول',
}

function getMessage(error?: string | null) {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'هذا البريد مرتبط بمزوّد آخر. يرجى تسجيل الدخول بنفس المزوّد.'
    case 'CredentialsSignin':
      return 'بيانات الاعتماد غير صحيحة. تحقق من البريد وكلمة المرور.'
    case 'AccessDenied':
      return 'الوصول مرفوض. لا تملك الصلاحيات اللازمة.'
    default:
      return 'حدث خطأ غير متوقع أثناء تسجيل الدخول.'
  }
}

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const message = getMessage(searchParams?.error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">حدث خطأ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTitle>تعذّر تسجيل الدخول</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>

          <div className="flex gap-2 justify-center">
            <Button asChild>
              <Link href="/auth/signin">العودة لصفحة تسجيل الدخول</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">العودة إلى الرئيسية</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
