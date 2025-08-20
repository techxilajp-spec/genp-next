import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a currency amount in Japanese Yen
 * @param amount - The amount to format
 * @returns The formatted currency amount (eg. ¥ 1,000)
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a percentage value
 * @param number - The number to format
 * @returns The formatted percentage value (eg. 100%)
 */
export const formatPercentage = (number: number) => {
  if (number === 0) return "0%";
  const percentage = Math.floor(number);
  return `${percentage}%`;
};

