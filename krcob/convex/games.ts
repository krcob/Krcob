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

export const checkAdminStatus = query({
  args: {},
  handler: async (ctx) => {
    const adminInfo = await getAdminInfo(ctx);
    return adminInfo !== null;
  },
});

export const getCurrentAdminName = query({
  args: {},
  handler: async (ctx) => {
    const adminInfo = await getAdminInfo(ctx);
    return adminInfo?.adminName || null;
  },
});

export const list = query({
  args: {
    categories: v.optional(v.array(v.string())),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.searchQuery) {
      const searchResults = await ctx.db
        .query("games")
        .withSearchIndex("search_title", (q) => 
          q.search("title", args.searchQuery!)
        )
        .collect();
      
      if (args.categories && args.categories.length > 0) {
        return searchResults.filter(game => 
          game.categories.some(category => args.categories!.includes(category))
        ).sort((a, b) => b._creationTime - a._creationTime);
      }
      
      return searchResults.sort((a, b) => b._creationTime - a._creationTime);
    }
    
    let result = await ctx.db.query("games").order("desc").collect();
    
    if (args.categories && args.categories.length > 0) {
      result = result.filter(game => 
        game.categories.some(category => args.categories!.includes(category))
      );
    }
    
    return result;
  },
});

export const getById = query({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoUrl: v.optional(v.string()),
    additionalVideos: v.optional(v.array(v.string())),
    categories: v.array(v.string()),
    imageUrl: v.string(),
    additionalImages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بإضافة الألعاب");
    }

    return await ctx.db.insert("games", {
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      additionalVideos: args.additionalVideos || [],
      categories: args.categories,
      imageUrl: args.imageUrl,
      additionalImages: args.additionalImages || [],
      createdBy: adminInfo.userId,
      createdByName: adminInfo.adminName,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("games"),
    title: v.string(),
    description: v.string(),
    videoUrl: v.optional(v.string()),
    additionalVideos: v.optional(v.array(v.string())),
    categories: v.array(v.string()),
    imageUrl: v.string(),
    additionalImages: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بتعديل الألعاب");
    }

    const existingGame = await ctx.db.get(args.id);
    if (!existingGame) {
      throw new Error("اللعبة غير موجودة");
    }

    return await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      additionalVideos: args.additionalVideos || [],
      categories: args.categories,
      imageUrl: args.imageUrl,
      additionalImages: args.additionalImages || [],
      updatedAt: Date.now(),
      updatedBy: adminInfo.userId,
      updatedByName: adminInfo.adminName,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    const adminInfo = await getAdminInfo(ctx);
    if (!adminInfo) {
      throw new Error("غير مصرح لك بحذف الألعاب");
    }

    return await ctx.db.delete(args.id);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const tags = await ctx.db.query("tags").collect();
    return tags.map(tag => tag.name);
  },
});

export const getCategoriesWithDescriptions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const verifyAdminCode = mutation({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    if (!ADMIN_CODES[args.code as keyof typeof ADMIN_CODES]) {
      throw new Error("كود الإدارة غير صحيح");
    }

    const adminName = ADMIN_CODES[args.code as keyof typeof ADMIN_CODES];

    await ctx.db.patch(userId, {
      adminCode: args.code,
    });

    return { success: true, adminName };
  },
});
