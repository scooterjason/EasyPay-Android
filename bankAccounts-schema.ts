import { int, mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

/**
 * Bank Accounts table for mobile banking apps
 * Stores user bank account information with proper user isolation
 */
export const bankAccounts = mysqlTable("bankAccounts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  accountHolderName: varchar("accountHolderName", { length: 255 }).notNull(),
  bankName: varchar("bankName", { length: 255 }).notNull(),
  accountNumber: varchar("accountNumber", { length: 255 }).notNull(),
  routingNumber: varchar("routingNumber", { length: 20 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = typeof bankAccounts.$inferInsert;

/**
 * Transactions table for mobile banking apps
 * Stores payment transaction records with proper user isolation
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Foreign key to users table
  bankAccountId: int("bankAccountId").notNull(), // Foreign key to bankAccounts
  amount: int("amount").notNull(), // Stored in cents to avoid floating point issues
  description: varchar("description", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;
