import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // المعدات
  equipment: defineTable({
    titleAr: v.string(),
    titleEn: v.string(),
    slug: v.string(),
    condition: v.union(v.literal("new"), v.literal("used"), v.literal("excellent")),
    price: v.optional(v.number()),
    currency: v.string(), // SAR
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
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"]),

  // السكراب
  scrap: defineTable({
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
    priceNote: v.optional(v.string()), // "حسب السعر اليومي"
    status: v.union(v.literal("active"), v.literal("sold")),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  // المزادات
  auctions: defineTable({
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
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  // رسائل التواصل
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    read: v.boolean(),
  })
    .index("by_read", ["read"]),

  // إعدادات الموقع
  siteSettings: defineTable({
    key: v.string(),
    valueAr: v.optional(v.string()),
    valueEn: v.optional(v.string()),
    valueNumber: v.optional(v.number()),
  })
    .index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
