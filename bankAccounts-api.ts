import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { and, eq } from "drizzle-orm";
import { bankAccounts, transactions } from "../drizzle/schema";

/**
 * Bank Accounts API Router
 * Complete tRPC procedures for managing bank accounts and transactions
 * All procedures are protected and require authentication
 */

// Validation schemas
const addAccountSchema = z.object({
  accountHolderName: z
    .string()
    .min(1, "Account holder name is required")
    .max(255, "Account holder name is too long"),
  bankName: z
    .string()
    .min(1, "Bank name is required")
    .max(255, "Bank name is too long"),
  accountNumber: z
    .string()
    .min(8, "Account number must be at least 8 digits")
    .max(255, "Account number is too long"),
  routingNumber: z
    .string()
    .regex(/^\d{9}$/, "Routing number must be exactly 9 digits"),
});

const createTransactionSchema = z.object({
  bankAccountId: z.number().positive("Invalid bank account"),
  amount: z.number().positive("Amount must be greater than 0").max(999999.99, "Amount is too large"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "Description is too long"),
});

/**
 * Bank Accounts Router
 */
export const bankAccountsRouter = router({
  /**
   * Add a new bank account
   * POST /api/trpc/bankAccounts.add
   */
  add: protectedProcedure
    .input(addAccountSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        await db.insert(bankAccounts).values({
          userId: ctx.user.id,
          accountHolderName: input.accountHolderName,
          bankName: input.bankName,
          accountNumber: input.accountNumber,
          routingNumber: input.routingNumber,
        });

        return { success: true, message: "Bank account added successfully" };
      } catch (error) {
        console.error("Error adding bank account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add bank account",
        });
      }
    }),

  /**
   * Get all bank accounts for the current user
   * GET /api/trpc/bankAccounts.list
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const accounts = await db
        .select()
        .from(bankAccounts)
        .where(eq(bankAccounts.userId, ctx.user.id))
        .orderBy(bankAccounts.createdAt);

      return accounts;
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch bank accounts",
      });
    }
  }),

  /**
   * Get a specific bank account by ID
   * GET /api/trpc/bankAccounts.getById
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const account = await db
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.id),
              eq(bankAccounts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (account.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Bank account not found",
          });
        }

        return account[0];
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error fetching bank account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch bank account",
        });
      }
    }),

  /**
   * Delete a bank account
   * DELETE /api/trpc/bankAccounts.delete
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify ownership before deleting
        const account = await db
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.id),
              eq(bankAccounts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (account.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Bank account not found",
          });
        }

        await db
          .delete(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.id),
              eq(bankAccounts.userId, ctx.user.id)
            )
          );

        return { success: true, message: "Bank account deleted successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error deleting bank account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete bank account",
        });
      }
    }),

  /**
   * Update a bank account
   * PUT /api/trpc/bankAccounts.update
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        ...addAccountSchema.partial().shape,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        const { id, ...updateData } = input;

        // Verify ownership before updating
        const account = await db
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, id),
              eq(bankAccounts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (account.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Bank account not found",
          });
        }

        await db
          .update(bankAccounts)
          .set(updateData)
          .where(
            and(
              eq(bankAccounts.id, id),
              eq(bankAccounts.userId, ctx.user.id)
            )
          );

        return { success: true, message: "Bank account updated successfully" };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error updating bank account:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update bank account",
        });
      }
    }),
});

/**
 * Transactions Router
 */
export const transactionsRouter = router({
  /**
   * Create a new transaction
   * POST /api/trpc/transactions.create
   */
  create: protectedProcedure
    .input(createTransactionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify bank account belongs to user
        const account = await db
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.bankAccountId),
              eq(bankAccounts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (account.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Bank account not found",
          });
        }

        // Convert amount to cents
        const amountInCents = Math.round(input.amount * 100);

        await db.insert(transactions).values({
          userId: ctx.user.id,
          bankAccountId: input.bankAccountId,
          amount: amountInCents,
          description: input.description,
        });

        return {
          success: true,
          message: "Transaction created successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error creating transaction:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create transaction",
        });
      }
    }),

  /**
   * Get all transactions for the current user
   * GET /api/trpc/transactions.list
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const txns = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, ctx.user.id))
        .orderBy(transactions.createdAt);

      return txns;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch transactions",
      });
    }
  }),

  /**
   * Get transactions for a specific bank account
   * GET /api/trpc/transactions.getByAccount
   */
  getByAccount: protectedProcedure
    .input(z.object({ bankAccountId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");

        // Verify bank account belongs to user
        const account = await db
          .select()
          .from(bankAccounts)
          .where(
            and(
              eq(bankAccounts.id, input.bankAccountId),
              eq(bankAccounts.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (account.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Bank account not found",
          });
        }

        const txns = await db
          .select()
          .from(transactions)
          .where(
            and(
              eq(transactions.userId, ctx.user.id),
              eq(transactions.bankAccountId, input.bankAccountId)
            )
          )
          .orderBy(transactions.createdAt);

        return txns;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Error fetching account transactions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch account transactions",
        });
      }
    }),

  /**
   * Get transaction statistics for the current user
   * GET /api/trpc/transactions.getStats
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      const txns = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, ctx.user.id));

      const totalAmount = txns.reduce((sum, txn) => sum + txn.amount, 0);
      const totalCount = txns.length;
      const averageAmount = totalCount > 0 ? Math.round(totalAmount / totalCount) : 0;

      return {
        totalTransactions: totalCount,
        totalSpent: totalAmount, // in cents
        averageTransaction: averageAmount, // in cents
        lastTransaction: txns.length > 0 ? txns[txns.length - 1]?.createdAt : null,
      };
    } catch (error) {
      console.error("Error fetching transaction stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch transaction statistics",
      });
    }
  }),
});
