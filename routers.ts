import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  bankAccounts: router({
    add: protectedProcedure
      .input(
        z.object({
          accountHolderName: z.string().min(1, "Account holder name is required"),
          bankName: z.string().min(1, "Bank name is required"),
          accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
          routingNumber: z.string().min(9, "Routing number must be 9 digits"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createBankAccount } = await import("./db");
        await createBankAccount(ctx.user.id, input);
        return { success: true };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getBankAccountsByUserId } = await import("./db");
      return getBankAccountsByUserId(ctx.user.id);
    }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteBankAccount } = await import("./db");
        await deleteBankAccount(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
  transactions: router({
    create: protectedProcedure
      .input(
        z.object({
          bankAccountId: z.number(),
          amount: z.number().positive("Amount must be positive"),
          description: z.string().min(1, "Description is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createTransaction, getBankAccountById } = await import("./db");
        // Verify the bank account belongs to the user
        const account = await getBankAccountById(input.bankAccountId, ctx.user.id);
        if (!account) {
          throw new Error("Bank account not found");
        }
        await createTransaction(ctx.user.id, input);
        return { success: true };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getTransactionsByUserId } = await import("./db");
      return getTransactionsByUserId(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
