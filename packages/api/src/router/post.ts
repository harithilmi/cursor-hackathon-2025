import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.convex.query(api.posts.list);
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.convex.query(api.posts.byId, {
        id: input.id as Id<"posts">,
      });
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.convex.mutation(api.posts.create, {
        title: input.title,
        content: input.content,
      });
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    // Note: Convex will validate the ID format and throw if invalid
    return await ctx.convex.mutation(api.posts.deletePost, {
      id: input as Id<"posts">,
    });
  }),
} satisfies TRPCRouterRecord;
