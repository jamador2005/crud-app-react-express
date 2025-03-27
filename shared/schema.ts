import { pgTable, text, serial, integer, boolean, varchar, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User resource
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

// Post resource
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts)
  .omit({ id: true, createdAt: true });

// Comment resource
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  body: text("body").notNull(),
  postId: integer("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments)
  .omit({ id: true, createdAt: true });

// Product resource
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // We define price as numeric in the DB schema
  // However, in our TypeScript code we'll treat it as a number
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create the base insert schema
const baseProductSchema = createInsertSchema(products)
  .omit({ id: true, createdAt: true });

// To understand what's happening here:
// 1. In our database/storage schema, `price` is defined as numeric (which implies a number)
// 2. On the frontend, we handle it as a string in the form inputs
// 3. When submitting data from frontend to backend, we accept either string or number
// 4. We ensure all price values are consistently stored as numbers in our storage
export const insertProductSchema = baseProductSchema.extend({
  price: z.union([z.string(), z.number()])
    .transform(val => typeof val === 'string' ? parseFloat(val) : val)
    .pipe(z.number().positive("Price must be a positive number"))
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

// Modify the type definitions to match our implementation needs
export type Product = Omit<typeof products.$inferSelect, 'price'> & { 
  price: number;  // In our storage, price is always a number
};

export type InsertProduct = Omit<z.infer<typeof insertProductSchema>, 'price'> & {
  price: string | number;  // For insertion, we allow either string or number
};

// Resource type
export type ResourceType = 'users' | 'posts' | 'comments' | 'products';
