import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// قائمة السكراب (عامة)
export const list = query({
  args: {
    city: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const scrap = args.status
      ? await ctx.db
          .query("scrap")
          .withIndex("by_status", (q) => q.eq("status", args.status as any))
          .collect()
      : await ctx.db.query("scrap").collect();

    // تطبيق الفلاتر
    let filtered = scrap;
    if (args.city) {
      filtered = filtered.filter((s) => s.city === args.city);
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

// تفاصيل سكراب واحد
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const scrap = await ctx.db
      .query("scrap")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!scrap) return null;

    const imageUrls = await Promise.all(
      scrap.images.map((id) => ctx.storage.getUrl(id))
    );

    return {
      ...scrap,
      imageUrls: imageUrls.filter((url): url is string => url !== null),
    };
  },
});

// إضافة سكراب (للمسؤولين فقط)
export const create = mutation({
  args: {
    titleAr: v.string(),
    titleEn: v.string(),
    slug: v.string(),
    city: v.string(),
    specs: v.array(v.object({
      labelAr: v.string(),
      labelEn: v.string(),
      value: v.string(),
    })),
    images: v.array(v.id("_storage")),
    descriptionAr: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    priceNote: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("sold")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const scrapId = await ctx.db.insert("scrap", args);
    return scrapId;
  },
});

// حذف سكراب
export const remove = mutation({
  args: { id: v.id("scrap") },
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
