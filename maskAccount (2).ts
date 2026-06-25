/**
 * Masks a bank account number, showing only the last 4 digits
 * Security best practice: Always mask account numbers in UI
 * @param accountNumber - The full account number to mask
 * @returns Masked account number (e.g., "••••••5678")
 */
export function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length < 4) {
    return "••••••••";
  }
  const lastFour = accountNumber.slice(-4);
  const maskedLength = Math.max(accountNumber.length - 4, 4);
  return "•".repeat(maskedLength) + lastFour;
}

/**
 * Gets the last 4 digits of an account number
 * @param accountNumber - The full account number
 * @returns Last 4 digits (e.g., "5678")
 */
export function getLastFourDigits(accountNumber: string): string {
  return accountNumber.slice(-4);
}
