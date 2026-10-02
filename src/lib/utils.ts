import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers in the standard Indian currency format (e.g. ₹1,25,000.00)
 */
export function formatINR(amount: number | string | undefined | null, includeSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return includeSymbol ? '₹0.00' : '0.00';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const parts = absNum.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Indian comma separation: last 3 digits, then groups of 2 digits
  if (integerPart.length > 3) {
    const last3 = integerPart.substring(integerPart.length - 3);
    const rest = integerPart.substring(0, integerPart.length - 3);
    const regex = /(\d+?)(?=(\d{2})+$)/g;
    const formattedRest = rest.replace(regex, '$1,');
    integerPart = formattedRest + ',' + last3;
  }

  const formatted = `${integerPart}.${decimalPart}`;
  const sign = isNegative ? '-' : '';
  return includeSymbol ? `${sign}₹${formatted}` : `${sign}${formatted}`;
}

/**
 * Converts numbers into words in the Indian Numbering System (Crore, Lakh, Thousand, Hundred)
 */
export function numberToWordsIndian(num: number): string {
  if (isNaN(num) || num === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n];
    if (n >= 10 && n < 20) return twoDigits[n - 10];
    return tensMultiple[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + singleDigits[n % 10] : '');
  };

  const convertThreeDigits = (n: number): string => {
    let result = '';
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    if (hundred > 0) {
      result += singleDigits[hundred] + ' Hundred';
      if (remainder > 0) result += ' and ';
    }
    if (remainder > 0) {
      result += convertTwoDigits(remainder);
    }
    return result;
  };

  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);

  let crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  const words: string[] = [];

  if (crore > 0) {
    words.push(convertThreeDigits(crore) + ' Crore');
  }
  if (lakh > 0) {
    words.push(convertTwoDigits(lakh) + ' Lakh');
  }
  if (thousand > 0) {
    words.push(convertTwoDigits(thousand) + ' Thousand');
  }
  if (remainder > 0) {
    words.push(convertThreeDigits(remainder));
  }

  let finalWords = words.join(' ').trim();
  if (!finalWords) finalWords = 'Zero';

  finalWords += ' Rupees';

  if (decimalPart > 0) {
    finalWords += ' and ' + convertTwoDigits(decimalPart) + ' Paise';
  }

  return finalWords + ' Only';
}

/**
 * Format ISO date string into DD/MM/YYYY
 */
export function formatDate(dateString?: string): string {
  if (!dateString) {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
  }
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return dateString;
  }
}

/**
 * Get current date as YYYY-MM-DD for input[type=date]
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get future date as YYYY-MM-DD (e.g. +15 days)
 */
export function getFutureDateISO(daysAhead = 15): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

/**
 * Indian Tax & Document Validations
 */
export function validateGSTIN(gstin: string): boolean {
  if (!gstin) return false;
  // 15 Character standard Indian GST format: 2 digits + 5 chars + 4 digits + 1 char + 1 char/digit + 'Z' + 1 char/digit
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.trim().toUpperCase());
}

export function validatePAN(pan: string): boolean {
  if (!pan) return false;
  // 10 Character standard Indian PAN: 5 uppercase letters + 4 digits + 1 uppercase letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.trim().toUpperCase());
}

export function validatePincode(pincode: string): boolean {
  if (!pincode) return false;
  // 6 digits, non-zero starting
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // 10 digit Indian mobile number, starting with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(cleanPhone.slice(-10));
}

/**
 * Generates standard UPI payment intent string for QR code
 */
export function generateUPIUrl(params: {
  upiId: string;
  payeeName: string;
  amount?: number;
  note?: string;
  transactionRef?: string;
}): string {
  const { upiId, payeeName, amount, note, transactionRef } = params;
  let url = `upi://pay?pa=${encodeURIComponent(upiId.trim())}&pn=${encodeURIComponent(payeeName.trim())}&cu=INR`;

  if (amount && amount > 0) {
    url += `&am=${amount.toFixed(2)}`;
  }
  if (note) {
    url += `&tn=${encodeURIComponent(note)}`;
  }
  if (transactionRef) {
    url += `&tr=${encodeURIComponent(transactionRef)}`;
  }
  return url;
}

/**
 * Generates direct WhatsApp click-to-chat URL
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}
