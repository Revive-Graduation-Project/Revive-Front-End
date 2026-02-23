import * as z from "zod";

/**
 * Validation Schema for Checkout
 * Ensures all required delivery and contact info is present.
 */
export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  phone: z.string().min(10, "Phone number is invalid"),
  region: z.string().min(1, "Region is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is too short"),
  zipCode: z.string().min(4, "Invalid Zip Code"),
});
