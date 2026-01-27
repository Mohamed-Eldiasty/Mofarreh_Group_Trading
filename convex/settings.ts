import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// جلب إعدادات الموقع (عامة)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").collect();
    
    const settingsMap: Record<string, any> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = {
        ar: setting.valueAr,
        en: setting.valueEn,
        number: setting.valueNumber,
      };
    });

    return settingsMap;
  },
});

// تحديث إعدادات (للمسؤولين فقط)
export const update = mutation({
  args: {
    key: v.string(),
    valueAr: v.optional(v.string()),
    valueEn: v.optional(v.string()),
    valueNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        valueAr: args.valueAr,
        valueEn: args.valueEn,
        valueNumber: args.valueNumber,
      });
    } else {
      await ctx.db.insert("siteSettings", args);
    }
  },
});
