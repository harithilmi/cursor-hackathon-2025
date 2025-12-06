import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save generated document to database
export const saveDocument = mutation({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    type: v.union(v.literal("resume"), v.literal("cover_letter")),
    content: v.string(),
    pdfUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if document already exists
    const existingDoc = await ctx.db
      .query("generatedDocuments")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId),
      )
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    if (existingDoc) {
      // Update existing document
      await ctx.db.patch(existingDoc._id, {
        content: args.content,
        pdfUrl: args.pdfUrl,
        generatedAt: Date.now(),
      });
      return existingDoc._id;
    }

    // Create new document
    const documentId = await ctx.db.insert("generatedDocuments", {
      userId: args.userId,
      jobId: args.jobId,
      type: args.type,
      content: args.content,
      pdfUrl: args.pdfUrl,
      generatedAt: Date.now(),
    });

    return documentId;
  },
});

// Get document for a specific job
export const getDocumentForJob = query({
  args: {
    userId: v.id("users"),
    jobId: v.id("jobListings"),
    type: v.union(v.literal("resume"), v.literal("cover_letter")),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query("generatedDocuments")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobId", args.jobId),
      )
      .filter((q) => q.eq(q.field("type"), args.type))
      .first();

    return document;
  },
});

// Get all documents for a user
export const getUserDocuments = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("generatedDocuments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return documents;
  },
});

// Get all documents for a specific job
export const getJobDocuments = query({
  args: {
    jobId: v.id("jobListings"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("generatedDocuments")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect();

    return documents;
  },
});

// Delete a document
export const deleteDocument = mutation({
  args: {
    documentId: v.id("generatedDocuments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.documentId);
  },
});

// Update PDF URL after generation
export const updatePdfUrl = mutation({
  args: {
    documentId: v.id("generatedDocuments"),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      pdfUrl: args.pdfUrl,
    });
  },
});
