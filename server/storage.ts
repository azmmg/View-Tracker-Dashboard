import { metrics, type Metric, type InsertMetric } from "@shared/schema";
import { db } from "./db";
import { addDays, startOfDay, subDays } from "date-fns";
import { eq } from "drizzle-orm";

export interface IStorage {
  getTodayMetrics(): Promise<Metric>;
  getLastWeekMetrics(): Promise<Metric>;
}

export class DatabaseStorage implements IStorage {
  async getTodayMetrics(): Promise<Metric> {
    const today = startOfDay(new Date());
    const [metric] = await db
      .select()
      .from(metrics)
      .where(eq(metrics.date, today));

    if (!metric) {
      // If no metrics exist for today, create them
      const newMetric: InsertMetric = {
        date: today,
        views: Math.floor(Math.random() * 1000) + 500,
        visits: Math.floor(Math.random() * 800) + 400,
        visitors: Math.floor(Math.random() * 600) + 300,
      };

      const [created] = await db
        .insert(metrics)
        .values(newMetric)
        .returning();

      return created;
    }

    return metric;
  }

  async getLastWeekMetrics(): Promise<Metric> {
    const lastWeek = startOfDay(subDays(new Date(), 7));
    const [metric] = await db
      .select()
      .from(metrics)
      .where(eq(metrics.date, lastWeek));

    if (!metric) {
      // If no metrics exist for last week, create them
      const newMetric: InsertMetric = {
        date: lastWeek,
        views: Math.floor(Math.random() * 1000) + 500,
        visits: Math.floor(Math.random() * 800) + 400,
        visitors: Math.floor(Math.random() * 600) + 300,
      };

      const [created] = await db
        .insert(metrics)
        .values(newMetric)
        .returning();

      return created;
    }

    return metric;
  }
}

export const storage = new DatabaseStorage();