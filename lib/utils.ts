import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key";

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

/**
 * Encrypt a string using AES encryption.
 * @param str - The plain string to encrypt
 * @returns Encrypted string (Base64)
 */
export const encryptString = (data: string) => {
  const cipherText = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString();
  return btoa(cipherText)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Make URL-safe
};

/**
 * Decrypt an AES-encrypted string.
 * @param encrypted - The encrypted string (Base64)
 * @returns Decrypted plain text string
 */
export const decryptString = (cipherText: string) => {
  try {
    const base64CipherText = cipherText.replace(/-/g, "+").replace(/_/g, "/"); // Convert back to original Base64
    const bytes = CryptoJS.AES.decrypt(atob(base64CipherText), ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    if (error) {
      return null;
    }
  }
};

/**
 * Convert date to locale date time
 * @param date - Date
 * @returns Locale date time (ja-JP)
 * @author ヤン
 */
export const convertToLocaleDateTime = (date: string, city: string, format: string = "YYYY/MM/DD") => {
  const convertedTime = dayjs.utc(date).tz(city).format(format);
  return convertedTime;
};
