import { and, desc, eq } from "drizzle-orm";
import { bankAccounts, transactions } from "../drizzle/schema";
import type { InsertBankAccount, InsertTransaction } from "../drizzle/schema";

/**
 * Create a new bank account for a user
 */
export async function createBankAccount(
  db: any,
  userId: number,
  data: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
  }
) {
  return await db.insert(bankAccounts).values({
    userId,
    ...data,
  });
}

/**
 * Get all bank accounts for a user
 */
export async function getBankAccountsByUserId(db: any, userId: number) {
  return await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.userId, userId));
}

/**
 * Get a specific bank account by ID (with user ownership verification)
 */
export async function getBankAccountById(db: any, id: number, userId: number) {
  const result = await db
    .select()
    .from(bankAccounts)
    .where(and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Delete a bank account (with user ownership verification)
 */
export async function deleteBankAccount(db: any, id: number, userId: number) {
  await db
    .delete(bankAccounts)
    .where(and(eq(bankAccounts.id, id), eq(bankAccounts.userId, userId)));
}

/**
 * Create a new transaction for a user
 */
export async function createTransaction(
  db: any,
  userId: number,
  data: {
    bankAccountId: number;
    amount: number;
    description: string;
  }
) {
  return await db.insert(transactions).values({
    userId,
    ...data,
  });
}

/**
 * Get all transactions for a user, sorted by newest first
 */
export async function getTransactionsByUserId(db: any, userId: number) {
  return await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));
}
