import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// قائمة المعدات (عامة)
export const list = query({
  args: {
    city: v.optional(v.string()),
    condition: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const equipment = args.status
      ? await ctx.db
          .query("equipment")
          .withIndex("by_status", (q) => q.eq("status", args.status as any))
          .collect()
      : await ctx.db.query("equipment").collect();

    // تطبيق الفلاتر
    let filtered = equipment;
    if (args.city) {
      filtered = filtered.filter((e) => e.city === args.city);
    }
    if (args.condition) {
      filtered = filtered.filter((e) => e.condition === args.condition);
    }

    // جلب روابط الصور
    const withImages = await Promise.all(
      filtered.map(async (item) => {
        const imageUrls = await Promise.all(
          item.images.map((id) => ctx.storage.getUrl(id))
        );
        return {
          ...item,
          imageUrls: imageUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return withImages;
  },
});

// المعدات المميزة
export const featured = query({
  args: {},
  handler: async (ctx) => {
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(3);

    const withImages = await Promise.all(
      equipment.map(async (item) => {
        const imageUrls = await Promise.all(
          item.images.map((id) => ctx.storage.getUrl(id))
        );
        return {
          ...item,
          imageUrls: imageUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return withImages;
  },
});

// تفاصيل معدة واحدة
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const equipment = await ctx.db
      .query("equipment")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!equipment) return null;

    const imageUrls = await Promise.all(
      equipment.images.map((id) => ctx.storage.getUrl(id))
    );

    return {
      ...equipment,
      imageUrls: imageUrls.filter((url): url is string => url !== null),
    };
  },
});

// إضافة معدة (للمسؤولين فقط)
export const create = mutation({
  args: {
    titleAr: v.string(),
    titleEn: v.string(),
    slug: v.string(),
    condition: v.union(v.literal("new"), v.literal("used"), v.literal("excellent")),
    price: v.optional(v.number()),
    currency: v.string(),
    city: v.string(),
    specs: v.array(v.object({
      labelAr: v.string(),
      labelEn: v.string(),
      value: v.string(),
    })),
    images: v.array(v.id("_storage")),
    descriptionAr: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    status: v.union(v.literal("active"), v.literal("sold"), v.literal("pending")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const equipmentId = await ctx.db.insert("equipment", args);
    return equipmentId;
  },
});

// تحديث معدة
export const update = mutation({
  args: {
    id: v.id("equipment"),
    titleAr: v.optional(v.string()),
    titleEn: v.optional(v.string()),
    condition: v.optional(v.union(v.literal("new"), v.literal("used"), v.literal("excellent"))),
    price: v.optional(v.number()),
    city: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("sold"), v.literal("pending"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// حذف معدة
export const remove = mutation({
  args: { id: v.id("equipment") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    await ctx.db.delete(args.id);
  },
});

// رفع صورة
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// إحصائيات المعدات
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("equipment").collect();
    const active = all.filter(e => e.status === "active").length;
    const sold = all.filter(e => e.status === "sold").length;
    const pending = all.filter(e => e.status === "pending").length;
    
    return {
      total: all.length,
      active,
      sold,
      pending,
    };
  },
});
