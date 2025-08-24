# إعداد Supabase السريع

## الخطوات (5 دقائق):

1. **اذهب إلى**: https://supabase.com
2. **سجل دخول** بحساب GitHub أو Google
3. **إنشاء مشروع جديد**:
   - اسم المشروع: `feasibility-study-platform`
   - كلمة مرور قاعدة البيانات: اختر كلمة مرور قوية (احفظها!)
   - المنطقة: اختر الأقرب (مثل eu-west-1)

4. **انتظر** حتى ينتهي إنشاء المشروع (2-3 دقائق)

5. **اذهب إلى Settings > Database**

6. **انسخ Connection String**:
   - اختر "URI" 
   - انسخ الرابط الكامل

7. **استبدل في .env.local**:
   ```
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

## ثم شغّل:
```bash
npm run test-connection  # للتأكد من الاتصال
npx prisma migrate dev --name init  # إنشاء الجداول
npm run seed  # إضافة البيانات التجريبية
```
