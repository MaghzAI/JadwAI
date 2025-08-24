import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 اختبار الاتصال بقاعدة البيانات...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL غير موجود. تأكد من وجوده في ملف .env أو .env.local في جذر المشروع');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');

    // اختبار استعلام بسيط
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('📊 اختبار الاستعلام:', result);
    
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
