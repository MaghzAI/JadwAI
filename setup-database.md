# دليل إعداد قاعدة البيانات

## خيار 1: Supabase (مُوصى به)

### الخطوات:
1. **إنشاء حساب**: اذهب إلى [supabase.com](https://supabase.com)
2. **إنشاء مشروع جديد**:
   - اسم المشروع: `feasibility-study-platform`
   - كلمة مرور قاعدة البيانات: (احفظها جيداً)
   - المنطقة: اختر الأقرب لك

3. **الحصول على رابط الاتصال**:
   ```
   Settings > Database > Connection string > URI
   ```

4. **إنشاء ملف .env.local**:
   ```bash
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## خيار 2: PostgreSQL المحلي

### تثبيت PostgreSQL:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Windows
# تنزيل من https://www.postgresql.org/download/windows/
```

### إنشاء قاعدة البيانات:
```bash
sudo -u postgres psql
CREATE DATABASE feasibility_study_platform;
CREATE USER your_username WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE feasibility_study_platform TO your_username;
\q
```

### ملف .env.local:
```bash
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/feasibility_study_platform"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## الخطوات التالية بعد الإعداد:

1. **تشغيل Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **تشغيل Prisma Studio** (اختياري):
   ```bash
   npx prisma studio
   ```

3. **إضافة بيانات تجريبية**:
   ```bash
   npm run seed
   ```
