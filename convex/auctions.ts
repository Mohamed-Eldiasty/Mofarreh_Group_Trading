import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// قائمة المزادات (عامة)
export const list = query({
  args: {
    status: v.optional(v.string()),
    kind: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auctions = args.status
      ? await ctx.db
          .query("auctions")
          .withIndex("by_status", (q) => q.eq("status", args.status as any))
          .collect()
      : await ctx.db.query("auctions").collect();

    // تطبيق الفلاتر
    let filtered = auctions;
    if (args.kind) {
      filtered = filtered.filter((a) => a.kind === args.kind);
    }

    // جلب روابط الصور
    const withImages = await Promise.all(
      filtered.map(async (item) => {
        const heroUrl = await ctx.storage.getUrl(item.heroImage);
        const galleryUrls = await Promise.all(
          item.gallery.map((id) => ctx.storage.getUrl(id))
        );
        return {
          ...item,
          heroUrl,
          galleryUrls: galleryUrls.filter((url): url is string => url !== null),
        };
      })
    );

    return withImages;
  },
});

// تفاصيل مزاد واحد
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const auction = await ctx.db
      .query("auctions")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!auction) return null;

    const heroUrl = await ctx.storage.getUrl(auction.heroImage);
    const galleryUrls = await Promise.all(
      auction.gallery.map((id) => ctx.storage.getUrl(id))
    );

    return {
      ...auction,
      heroUrl,
      galleryUrls: galleryUrls.filter((url): url is string => url !== null),
    };
  },
});

// إضافة مزاد (للمسؤولين فقط)
export const create = mutation({
  args: {
    titleAr: v.string(),
    titleEn: v.string(),
    slug: v.string(),
    status: v.union(v.literal("ongoing"), v.literal("upcoming"), v.literal("ended")),
    kind: v.union(v.literal("in-person"), v.literal("online"), v.literal("sealed-bid")),
    startDate: v.number(),
    endDate: v.number(),
    city: v.string(),
    heroImage: v.id("_storage"),
    gallery: v.array(v.id("_storage")),
    descriptionAr: v.string(),
    descriptionEn: v.string(),
    termsAr: v.optional(v.string()),
    termsEn: v.optional(v.string()),
    mapUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const auctionId = await ctx.db.insert("auctions", args);
    return auctionId;
  },
});

// حذف مزاد
export const remove = mutation({
  args: { id: v.id("auctions") },
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
