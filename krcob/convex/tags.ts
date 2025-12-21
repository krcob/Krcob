import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Admin codes with their corresponding names
const ADMIN_CODES = {
  "AD5d(9&F4EzU": "Krcob",
  "9z657E8jjMF": "y._u", 
  "M16K3u6uAt": "Admin 1",
  "PBewnS7R55": "Admin 2",
  "2Gd6uj7X": "Admin 3"
} as const;

async function getAdminInfo(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  
  const user = await ctx.db.get(userId);
  if (!user?.adminCode || !ADMIN_CODES[user.adminCode as keyof typeof ADMIN_CODES]) {
    return null;
  }
  
  return {
    userId,
    adminCode: user.adminCode,
    adminName: ADMIN_CODES[user.adminCode as keyof typeof ADMIN_CODES]
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بإضافة التصنيفات");
    }

    // Check if tag already exists
    const existingTag = await ctx.db
      .query("tags")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existingTag) {
      throw new Error("هذا التصنيف موجود بالفعل");
    }

    return await ctx.db.insert("tags", {
      name: args.name,
      description: args.description,
      createdBy: adminInfo.userId,
      createdByName: adminInfo.adminName,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tags"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بتعديل التصنيفات");
    }

    const existingTag = await ctx.db.get(args.id);
    if (!existingTag) {
      throw new Error("التصنيف غير موجود");
    }

    // Check if another tag with the same name exists
    const duplicateTag = await ctx.db
      .query("tags")
      .filter((q) => q.and(
        q.eq(q.field("name"), args.name),
        q.neq(q.field("_id"), args.id)
      ))
      .first();

    if (duplicateTag) {
      throw new Error("يوجد تصنيف آخر بنفس الاسم");
    }

    return await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      updatedAt: Date.now(),
      updatedBy: adminInfo.userId,
      updatedByName: adminInfo.adminName,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بحذف التصنيفات");
    }

    const tag = await ctx.db.get(args.id);
    if (!tag) {
      throw new Error("التصنيف غير موجود");
    }

    // Check if any games use this tag
    const allGames = await ctx.db.query("games").collect();
    const gamesWithTag = allGames.find(game => 
      game.categories.includes(tag.name)
    );

    if (gamesWithTag) {
      throw new Error("لا يمكن حذف هذا التصنيف لأنه مستخدم في بعض الألعاب");
    }

    return await ctx.db.delete(args.id);
  },
});
