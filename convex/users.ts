import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// التحقق من وجود مستخدم بـ username
export const checkUser = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const user = users.find(u => u.name === args.username);
    return {
      exists: !!user,
      totalUsers: users.length,
      allUsernames: users.map(u => u.name || u.email),
    };
  },
});

// الحصول على جميع المستخدمين (للتطوير فقط)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u._creationTime,
    }));
  },
});

// حذف جميع المستخدمين (للتطوير فقط)
export const deleteAll = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    return { deleted: users.length };
  },
});
