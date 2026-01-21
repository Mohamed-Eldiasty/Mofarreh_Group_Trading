import { mutation } from "./_generated/server";
import { Password } from "@convex-dev/auth/providers/Password";

// إضافة بيانات تجريبية للمعدات
export const seedEquipment = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("equipment").first();
    if (existing) {
      return { message: "البيانات موجودة بالفعل" };
    }

    const sampleEquipment = [
      {
        titleAr: "حفارة كاتربيلر 320D",
        titleEn: "Caterpillar 320D Excavator",
        slug: "caterpillar-320d-excavator",
        condition: "excellent" as const,
        price: 450000,
        currency: "SAR",
        city: "الرياض",
        specs: [
          { labelAr: "سنة الصنع", labelEn: "Year", value: "2018" },
          { labelAr: "ساعات العمل", labelEn: "Hours", value: "3,500" },
          { labelAr: "الوزن", labelEn: "Weight", value: "20 طن" },
        ],
        images: [],
        descriptionAr: "حفارة كاتربيلر بحالة ممتازة، صيانة دورية منتظمة",
        descriptionEn: "Caterpillar excavator in excellent condition",
        featured: true,
        status: "active" as const,
      },
      {
        titleAr: "رافعة شوكية تويوتا 3 طن",
        titleEn: "Toyota Forklift 3 Ton",
        slug: "toyota-forklift-3ton",
        condition: "used" as const,
        price: 85000,
        currency: "SAR",
        city: "جدة",
        specs: [
          { labelAr: "الحمولة", labelEn: "Capacity", value: "3 طن" },
          { labelAr: "نوع الوقود", labelEn: "Fuel", value: "ديزل" },
        ],
        images: [],
        descriptionAr: "رافعة شوكية مستعملة بحالة جيدة جداً",
        descriptionEn: "Used forklift in very good condition",
        featured: true,
        status: "active" as const,
      },
      {
        titleAr: "شاحنة مرسيدس أكتروس",
        titleEn: "Mercedes Actros Truck",
        slug: "mercedes-actros-truck",
        condition: "new" as const,
        price: 620000,
        currency: "SAR",
        city: "الدمام",
        specs: [
          { labelAr: "الموديل", labelEn: "Model", value: "2023" },
          { labelAr: "القوة", labelEn: "Power", value: "450 حصان" },
        ],
        images: [],
        descriptionAr: "شاحنة جديدة بالكامل، لم تستخدم",
        descriptionEn: "Brand new truck, never used",
        featured: true,
        status: "active" as const,
      },
    ];

    for (const equipment of sampleEquipment) {
      await ctx.db.insert("equipment", equipment);
    }

    return { success: true, count: sampleEquipment.length };
  },
});

// إضافة بيانات تجريبية للمزادات
export const seedAuctions = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("auctions").first();
    if (existing) {
      return { message: "البيانات موجودة بالفعل" };
    }

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const sampleAuctions = [
      {
        titleAr: "مزاد معدات ثقيلة - الرياض",
        titleEn: "Heavy Equipment Auction - Riyadh",
        slug: "heavy-equipment-riyadh-2024",
        status: "ongoing" as const,
        kind: "in-person" as const,
        startDate: now - oneDay,
        endDate: now + (3 * oneDay),
        city: "الرياض",
        heroImage: "" as any,
        gallery: [],
        descriptionAr: "مزاد شامل لمعدات ثقيلة متنوعة",
        descriptionEn: "Comprehensive heavy equipment auction",
        termsAr: "الدفع نقداً أو بنكي، رسوم المزاد 5%",
        termsEn: "Cash or bank payment, 5% auction fees",
      },
      {
        titleAr: "مزاد إلكتروني - معدات بناء",
        titleEn: "Online Auction - Construction Equipment",
        slug: "online-construction-2024",
        status: "upcoming" as const,
        kind: "online" as const,
        startDate: now + (7 * oneDay),
        endDate: now + (10 * oneDay),
        city: "جدة",
        heroImage: "" as any,
        gallery: [],
        descriptionAr: "مزاد إلكتروني لمعدات البناء",
        descriptionEn: "Online construction equipment auction",
      },
    ];

    for (const auction of sampleAuctions) {
      await ctx.db.insert("auctions", auction);
    }

    return { success: true, count: sampleAuctions.length };
  },
});

// إضافة بيانات تجريبية للسكراب
export const seedScrap = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("scrap").first();
    if (existing) {
      return { message: "البيانات موجودة بالفعل" };
    }

    const sampleScrap = [
      {
        titleAr: "حديد خردة - درجة أولى",
        titleEn: "Scrap Iron - Grade A",
        slug: "scrap-iron-grade-a",
        city: "الرياض",
        specs: [
          { labelAr: "النوع", labelEn: "Type", value: "حديد" },
          { labelAr: "الكمية", labelEn: "Quantity", value: "50 طن" },
        ],
        images: [],
        descriptionAr: "حديد خردة نظيف درجة أولى",
        descriptionEn: "Clean scrap iron grade A",
        priceNote: "حسب السعر اليومي",
        status: "active" as const,
      },
      {
        titleAr: "ألمنيوم خردة",
        titleEn: "Scrap Aluminum",
        slug: "scrap-aluminum",
        city: "جدة",
        specs: [
          { labelAr: "النوع", labelEn: "Type", value: "ألمنيوم" },
          { labelAr: "الكمية", labelEn: "Quantity", value: "20 طن" },
        ],
        images: [],
        descriptionAr: "ألمنيوم خردة نظيف",
        descriptionEn: "Clean scrap aluminum",
        priceNote: "حسب السعر اليومي",
        status: "active" as const,
      },
    ];

    for (const scrap of sampleScrap) {
      await ctx.db.insert("scrap", scrap);
    }

    return { success: true, count: sampleScrap.length };
  },
});

// إنشاء حساب المسؤول التجريبي
export const createDemoAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), "admin"))
      .first();
    
    if (existingUser) {
      return { message: "المستخدم موجود بالفعل" };
    }

    const userId = await ctx.db.insert("users", {
      name: "admin",
      email: "admin@mofarrehgroup.com",
    });

    return { success: true, userId };
  },
});

// إضافة جميع البيانات التجريبية
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results = {
      equipment: 0,
      auctions: 0,
      scrap: 0,
    };

    // معدات
    const equipmentExists = await ctx.db.query("equipment").first();
    if (!equipmentExists) {
      const equipmentData = [
        {
          titleAr: "حفارة كاتربيلر 320D",
          titleEn: "Caterpillar 320D Excavator",
          slug: "caterpillar-320d",
          condition: "excellent" as const,
          price: 450000,
          currency: "SAR",
          city: "الرياض",
          specs: [
            { labelAr: "سنة الصنع", labelEn: "Year", value: "2018" },
          ],
          images: [],
          featured: true,
          status: "active" as const,
        },
      ];
      for (const item of equipmentData) {
        await ctx.db.insert("equipment", item);
        results.equipment++;
      }
    }

    return { success: true, results };
  },
});
