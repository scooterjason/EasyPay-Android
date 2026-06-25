import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";

/**
 * Bank Accounts tRPC Router
 * Handles all bank account management operations
 */
export const bankAccountsRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        accountHolderName: z.string().min(1, "Account holder name is required"),
        bankName: z.string().min(1, "Bank name is required"),
        accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
        routingNumber: z.string().regex(/^\d{9}$/, "Routing number must be exactly 9 digits"),
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
});

/**
 * Transactions tRPC Router
 * Handles all transaction management operations
 */
export const transactionsRouter = router({
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
});
