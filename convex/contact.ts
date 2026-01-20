import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// إرسال رسالة تواصل (عامة)
export const send = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
    });
    return messageId;
  },
});

// قائمة الرسائل (للمسؤولين فقط)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const messages = await ctx.db
      .query("contactMessages")
      .order("desc")
      .collect();

    return messages;
  },
});

// تحديد رسالة كمقروءة
export const markAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    await ctx.db.patch(args.id, { read: true });
  },
});
