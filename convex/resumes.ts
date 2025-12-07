import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save or update user's resume
export const saveResume = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if resume already exists
    const existingResume = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingResume) {
      // Update existing resume
      await ctx.db.patch(existingResume._id, {
        content: args.content,
        updatedAt: Date.now(),
      });
      return existingResume._id;
    }

    // Create new resume
    const resumeId = await ctx.db.insert("resumes", {
      userId: args.userId,
      content: args.content,
      updatedAt: Date.now(),
    });

    return resumeId;
  },
});

// Get user's resume
export const getUserResume = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return resume;
  },
});

// Delete user's resume
export const deleteResume = mutation({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.resumeId);
  },
});

// Get all resumes (for admin/debugging)
export const getAllResumes = query({
  args: {},
  handler: async (ctx) => {
    const resumes = await ctx.db.query("resumes").collect();

    // Get user info for each resume
    const resumesWithUsers = await Promise.all(
      resumes.map(async (resume) => {
        const user = await ctx.db.get(resume.userId);
        return {
          ...resume,
          userEmail: user?.email,
          userName: user?.name,
        };
      })
    );

    return resumesWithUsers;
  },
});
