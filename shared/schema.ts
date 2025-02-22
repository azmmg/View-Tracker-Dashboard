import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  views: integer("views").notNull(),
  visits: integer("visits").notNull(),
  visitors: integer("visitors").notNull(),
});

// Update schema to handle ISO date strings
export const insertMetricSchema = createInsertSchema(metrics, {
  date: z.string().transform((str) => new Date(str)),
}).pick({
  date: true,
  views: true,
  visits: true,
  visitors: true,
});

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Metric = typeof metrics.$inferSelect;