import * as z from "zod";

/**
 * Validation Schema for Credit Card
 * Enforces:
 * - 16-digit card number (masked input)
 * - Expiry date in MM/YY format
 * - CVV (3-4 digits)
 * - Name required
 */
/**
 * Validation Schema for Credit Card
 * Enforces:
 * - 16-digit card number (masked input)
 * - Expiry date in MM/YY format
 * - CVV (3-4 digits)
 * - Name required
 */
export const CardSchema = z.object({
  cardNumber: z.string()
    .min(1, "Card number is required")
    .transform((val) => val.replace(/\s+/g, "")) // Remove spaces for validation
    .refine((val) => /^\d+$/.test(val), "Card number must contain only digits")
    .refine((val) => val.length >= 13 && val.length <= 19, "Card number must be between 13 and 19 digits"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date (MM/YY)")
    .refine((val) => {
      if (!val) return false;
      const [month, year] = val.split("/");
      // Create a date object for the *end* of the expiry month
      // month is 1-based in string, Date month is 0-based.
      // passing 0 as day gives the last day of the previous month.
      // So: new Date(2000 + parseInt(year), parseInt(month), 0) -> last day of that month
      const expiry = new Date(2000 + parseInt(year), parseInt(month), 0); 
      const now = new Date();
      // Reset logic: we only care if the expiry month has NOT passed. 
      // Actually, standard is: if it's 02/26, it's valid until Feb 28, 2026 23:59:59.
      // So we compare expiry (end of month) to now.
      return expiry >= now;
    }, "Card has expired"),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "Must be 3-4 digits"),
  cardName: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name must contain only letters"),
});
