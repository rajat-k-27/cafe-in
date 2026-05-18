import { z } from "zod";

export const menuItemInputSchema = z.object({
  name: z.string().min(2, "Name is too short.").max(80, "Name is too long."),
  category: z
    .string()
    .min(2, "Category is too short.")
    .max(40, "Category is too long."),
  price: z.coerce.number().min(0, "Price must be at least 0."),
  gstPercent: z.coerce.number().min(0, "GST must be 0 or higher.").max(28),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or higher."),
  isAvailable: z.coerce.boolean(),
  isSeasonal: z.coerce.boolean(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imagePublicId: z.string().optional().or(z.literal("")),
});

export type MenuItemInput = z.infer<typeof menuItemInputSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password is required."),
  role: z.enum(["admin", "user"]).optional(),
});

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
});

export const orderInputSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  address: z.string().min(5, "Address is required."),
  phone: z.string().min(8, "Phone is required."),
  notes: z.string().max(300).optional().or(z.literal("")),
});
