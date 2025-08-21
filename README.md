# 🚀 منصة دراسات الجدوى الذكية

## نظرة عامة

منصة احترافية وذكية لمساعدة أصحاب المشاريع والشركات في بناء دراسات الجدوى والتمويل الاحترافية بخطوات بسيطة وأدوات ذكية معتمدة على الذكاء الاصطناعي.

## ✨ الميزات الرئيسية

- 🤖 **توليد ذكي للدراسات**: استخدام الذكاء الاصطناعي لإنشاء دراسات شاملة ومخصصة
- 🔐 **أمان محكم**: حماية وعزل كامل لبيانات المستخدمين ومشاريعهم  
- 🌍 **متعدد اللغات**: دعم العربية والإنجليزية مع إمكانية إضافة المزيد
- 📱 **واجهة عصرية**: تجربة استخدام سلسة وجذابة على جميع الأجهزة
- 📄 **تصدير متعدد الصيغ**: PDF، Word، Excel مع تصاميم احترافية
- 🎨 **ثيمات متعددة**: وضع فاتح وداكن مع دعم الاتجاهات RTL/LTR
- 📊 **تحليلات متقدمة**: رسوم بيانية وتقارير مالية تفصيلية
- 🤝 **التعاون**: إمكانية مشاركة الدراسات والعمل التعاوني

## 🛠️ المكدس التقني

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **TypeScript**: 5.3+
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod
- **Components**: Radix UI + Shadcn/ui
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5+
- **Authentication**: NextAuth.js v5
- **AI**: AI SDK (Vercel) + OpenAI GPT-4
- **File Storage**: AWS S3 / Cloudinary
- **Email**: Resend

## 📁 هيكل المشروع

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # صفحات المصادقة
│   ├── dashboard/         # لوحة التحكم
│   ├── projects/          # إدارة المشاريع
│   ├── studies/           # دراسات الجدوى
│   ├── api/              # API Routes
│   └── globals.css       # الأنماط العامة
├── components/            # مكونات React
│   ├── ui/               # مكونات واجهة المستخدم الأساسية
│   ├── auth/             # مكونات المصادقة
│   ├── dashboard/        # مكونات لوحة التحكم
│   ├── projects/         # مكونات المشاريع
│   ├── study-wizard/     # معالج دراسة الجدوى
│   └── shared/           # مكونات مشتركة
├── lib/                  # مكتبات ومساعدين
│   ├── ai/              # خدمات الذكاء الاصطناعي
│   ├── auth/            # إعدادات المصادقة
│   ├── db/              # اتصالات قاعدة البيانات
│   ├── validations/     # مخططات التحقق
│   └── utils/           # دوال مساعدة
├── prisma/              # مخططات قاعدة البيانات
├── public/              # الملفات العامة
├── types/               # تعريفات TypeScript
├── hooks/               # React Hooks مخصصة
├── stores/              # إدارة الحالة (Zustand)
├── styles/              # ملفات الأنماط
├── docs/                # الوثائق
├── reports/             # تقارير المراحل
└── tests/               # الاختبارات
```

## 🚀 البدء السريع

### المتطلبات
- Node.js 20+
- PostgreSQL 15+
- Redis (اختياري للتخزين المؤقت)

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/feasibility-study-platform.git
cd feasibility-study-platform

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# تحديث متغيرات البيئة بالقيم المناسبة

# تهيئة قاعدة البيانات
npx prisma migrate dev --name init
npx prisma generate

# تشغيل خادم التطوير
npm run dev
```

## 📖 الوثائق

- [📋 خطة المشروع](./PLAN.md) - الخطة الشاملة للتطوير
- [📝 قائمة المهام](./TASKS.md) - المهام التفصيلية خطوة بخطوة
- [📊 تقارير المراحل](./reports/) - تقارير التقدم لكل مرحلة

## 🧪 الاختبار

```bash
# اختبارات الوحدة
npm run test

# اختبارات التكامل
npm run test:integration

# اختبارات E2E
npm run test:e2e

# تغطية الكود
npm run test:coverage
```

## 🏗️ البناء والنشر

```bash
# بناء التطبيق
npm run build

# تشغيل النسخة المبنية
npm start

# فحص الجودة
npm run lint
npm run type-check
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add some amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## 📞 التواصل والدعم

- **البريد الإلكتروني**: support@feasibility-platform.com
- **التوثيق**: [docs.feasibility-platform.com](https://docs.feasibility-platform.com)
- **المجتمع**: [Discord](https://discord.gg/feasibility-platform)

## 🎯 حالة المشروع

- ✅ **المرحلة الأولى**: الإعداد والبنية الأساسية
- ⏳ **المرحلة الثانية**: نظام المصادقة وإدارة المستخدمين
- ⏳ **المرحلة الثالثة**: إدارة المشاريع
- ⏳ **المرحلة الرابعة**: معالج دراسات الجدوى
- ⏳ **المرحلة الخامسة**: تكامل الذكاء الاصطناعي

---

**تم إنشاؤه بـ ❤️ باستخدام أحدث التقنيات لخدمة رواد الأعمال والمشاريع**
