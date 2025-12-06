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
      const posts = await ctx.convex.query(api.posts.list);
      return posts.find((post) => post._id === input.id);
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.convex.mutation(api.posts.create, {
        title: input.title,
        content: input.content,
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return await ctx.convex.mutation(api.posts.deletePost, {
      id: input as Id<"posts">,
    });
  }),
} satisfies TRPCRouterRecord;
