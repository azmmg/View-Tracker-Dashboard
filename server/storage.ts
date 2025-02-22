import { metrics, type Metric, type InsertMetric } from "@shared/schema";
import { addDays, startOfDay, subDays } from "date-fns";

export interface IStorage {
  getTodayMetrics(): Promise<Metric>;
  getLastWeekMetrics(): Promise<Metric>;
}

function generateRandomMetric(date: Date): Metric {
  const visitors = Math.floor(Math.random() * 1000) + 500;
  const visits = visitors + Math.floor(Math.random() * 500);
  const views = visits + Math.floor(Math.random() * 1000);
  
  return {
    id: Math.floor(Math.random() * 1000),
    date,
    views,
    visits,
    visitors,
  };
}

export class MemStorage implements IStorage {
  private metrics: Map<string, Metric>;

  constructor() {
    this.metrics = new Map();
    // Seed some initial data
    const today = startOfDay(new Date());
    const lastWeek = subDays(today, 7);
    
    this.metrics.set(today.toISOString(), generateRandomMetric(today));
    this.metrics.set(lastWeek.toISOString(), generateRandomMetric(lastWeek));
  }

  async getTodayMetrics(): Promise<Metric> {
    const today = startOfDay(new Date()).toISOString();
    return this.metrics.get(today) || generateRandomMetric(new Date(today));
  }

  async getLastWeekMetrics(): Promise<Metric> {
    const lastWeek = startOfDay(subDays(new Date(), 7)).toISOString();
    return this.metrics.get(lastWeek) || generateRandomMetric(new Date(lastWeek));
  }
}

export const storage = new MemStorage();
