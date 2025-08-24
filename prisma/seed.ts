import { PrismaClient, UserRole, ProjectStatus, StudyType, StudyStatus, Priority, TaskStatus, StageStatus, TeamRole, NotificationType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات التجريبية...');

  // Prepare default password for seeded users
  const defaultPassword = process.env.SEED_USER_PASSWORD || 'Password123!';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // إنشاء مستخدمين تجريبيين
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: passwordHash },
    create: {
      email: 'admin@example.com',
      name: 'مدير النظام',
      role: UserRole.ADMIN,
      avatar: null,
      password: passwordHash,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: { password: passwordHash },
    create: {
      email: 'manager@example.com',
      name: 'مدير المشاريع',
      role: UserRole.MANAGER,
      avatar: null,
      password: passwordHash,
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@example.com' },
    update: { password: passwordHash },
    create: {
      email: 'analyst@example.com',
      name: 'محلل مالي',
      role: UserRole.USER,
      avatar: null,
      password: passwordHash,
    },
  });

  console.log('✅ تم إنشاء المستخدمين');

  // إنشاء مشاريع تجريبية
  const project1 = await prisma.project.create({
    data: {
      name: 'مشروع التجارة الإلكترونية',
      description: 'منصة تجارة إلكترونية شاملة للأعمال الصغيرة والمتوسطة',
      industry: 'تكنولوجيا',
      location: 'الرياض، السعودية',
      currency: 'SAR',
      status: ProjectStatus.ACTIVE,
      userId: manager.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'تطبيق التوصيل',
      description: 'تطبيق ذكي لخدمات التوصيل السريع',
      industry: 'خدمات',
      location: 'جدة، السعودية',
      currency: 'SAR',
      status: ProjectStatus.DRAFT,
      userId: manager.id,
    },
  });

  console.log('✅ تم إنشاء المشاريع');

  // إنشاء دراسة جدوى
  const study1 = await prisma.feasibilityStudy.create({
    data: {
      title: 'دراسة الجدوى الاقتصادية - مشروع التجارة الإلكترونية',
      description: 'تحليل اقتصادي أولي للمشروع',
      type: StudyType.ECONOMIC,
      status: StudyStatus.COMPLETED,
      projectId: project1.id,
      userId: analyst.id,
      totalCost: 500000,
      expectedRevenue: 1200000,
      breakEvenPeriod: 18,
      roi: 1.4,
      npv: 250000,
      irr: 0.22,
      riskAssessment: 'مخاطر متوسطة مع فرص نمو جيدة',
      recommendations: 'البدء في التنفيذ مع مراقبة التكاليف بدقة',
      executiveSummary: 'الدراسة تشير إلى جدوى اقتصادية إيجابية',
    },
  });

  console.log('✅ تم إنشاء الدراسات');

  // إنشاء مراحل المشروع
  const stage1 = await prisma.projectStage.create({
    data: {
      name: 'التخطيط والتحليل',
      description: 'مرحلة التخطيط الأولي وتحليل المتطلبات',
      order: 1,
      status: StageStatus.COMPLETED,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-30'),
      projectId: project1.id,
    },
  });

  const stage2 = await prisma.projectStage.create({
    data: {
      name: 'التطوير',
      description: 'مرحلة تطوير النظام',
      order: 2,
      status: StageStatus.IN_PROGRESS,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      projectId: project1.id,
    },
  });

  // إنشاء المهام
  const task1 = await prisma.task.create({
    data: {
      title: 'تصميم واجهة المستخدم',
      description: 'تصميم واجهات المستخدم للموقع والتطبيق',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: new Date('2024-03-15'),
      projectId: project1.id,
      stageId: stage2.id,
      assigneeId: analyst.id,
    },
  });

  // إنشاء فريق المشروع
  await prisma.projectTeamMember.create({
    data: {
      role: TeamRole.MANAGER,
      userId: manager.id,
      projectId: project1.id,
    },
  });

  await prisma.projectTeamMember.create({
    data: {
      role: TeamRole.MEMBER,
      userId: analyst.id,
      projectId: project1.id,
    },
  });

  // إنشاء إشعارات تجريبية
  await prisma.notification.create({
    data: {
      title: 'مهمة جديدة مُسندة إليك',
      message: 'تم إسناد مهمة "تصميم واجهة المستخدم" إليك',
      type: NotificationType.INFO,
      isRead: false,
      userId: analyst.id,
    },
  });

  console.log('✅ تم إنشاء جميع البيانات التجريبية بنجاح!');
  console.log(`📊 المشاريع: 2`);
  console.log(`👥 المستخدمين: 3`);
  console.log(`📋 الدراسات: 1`);
  console.log(`🎯 المراحل: 2`);
  console.log(`✅ المهام: 1`);
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
