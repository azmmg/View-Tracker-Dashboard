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

export const insertMetricSchema = createInsertSchema(metrics).pick({
  date: true,
  views: true,
  visits: true,
  visitors: true,
});

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Metric = typeof metrics.$inferSelect;
