import { pgTable, integer, jsonb, timestamp, text, serial } from "drizzle-orm/pg-core";

export const siteConfig = pgTable("site_config", {
  id: integer("id").primaryKey().$default(() => 1),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  read: text("read").notNull().default("false"),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow(),
});
