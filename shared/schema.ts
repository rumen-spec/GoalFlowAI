import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  googleId: text("google_id"),
  email: text("email"),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  commitmentLevel: text("commitment_level").notNull(), // 'low', 'medium', 'high'
  outputFormat: text("output_format").notNull(), // 'calendar', 'checklist', 'summary'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").references(() => goals.id),
  title: text("title").notNull(),
  description: text("description"),
  week: integer("week").notNull(),
  completed: boolean("completed").notNull().default(false),
  dueDate: date("due_date"),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  googleId: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  title: true,
  commitmentLevel: true,
  outputFormat: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  goalId: true,
  title: true,
  description: true,
  week: true,
  dueDate: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
