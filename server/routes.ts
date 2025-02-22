import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/metrics", async (_req, res) => {
    try {
      const today = await storage.getTodayMetrics();
      const lastWeek = await storage.getLastWeekMetrics();
      
      res.json({ today, lastWeek });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
