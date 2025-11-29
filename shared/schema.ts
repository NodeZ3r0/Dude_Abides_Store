import { pgTable, text, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Products table - stores products from all POD vendors
export const products = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  description: text().notNull(),
  price: decimal({ precision: 10, scale: 2 }).notNull(),
  category: text().notNull(),
  image: text().notNull(),
  
  // POD vendor info
  vendor: text().notNull(), // 'printful', 'printify', 'custom', etc.
  vendorProductId: text(), // External ID from the POD platform
  vendorData: jsonb(), // Store vendor-specific metadata (variants, sizes, colors, etc.)
  
  // Stock/availability
  inStock: boolean().notNull().default(true),
  
  // Metadata
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL"),
  vendor: z.enum(["printful", "printify", "custom", "other"]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Shopping cart items - session-based
export const cartItems = pgTable("cart_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: text().notNull(), // Session ID for guest checkout
  productId: integer().notNull().references(() => products.id),
  quantity: integer().notNull().default(1),
  selectedVariant: jsonb(), // Store selected size, color, etc.
  addedAt: timestamp().notNull().defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems, {
  sessionId: z.string().min(1),
  productId: z.number().int().positive(),
}).omit({
  id: true,
  addedAt: true,
});

export const selectCartItemSchema = createSelectSchema(cartItems);

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
