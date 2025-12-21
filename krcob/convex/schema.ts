import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Extend the users table to include adminCode
const extendedAuthTables = {
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    adminCode: v.optional(v.string()),
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
};

const applicationTables = {
  games: defineTable({
    title: v.string(),
    description: v.string(),
    videoUrl: v.optional(v.string()),
    additionalVideos: v.optional(v.array(v.string())),
    categories: v.array(v.string()),
    imageUrl: v.string(),
    additionalImages: v.optional(v.array(v.string())),
    createdBy: v.id("users"),
    createdByName: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("users")),
    updatedByName: v.optional(v.string()),
  }).searchIndex("search_title", {
    searchField: "title",
  }),
  
  tags: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    createdByName: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    updatedBy: v.optional(v.id("users")),
    updatedByName: v.optional(v.string()),
  }).index("by_name", ["name"]),
};

export default defineSchema({
  ...extendedAuthTables,
  ...applicationTables,
});
