import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMetricSchema } from "@shared/schema";

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

  app.post("/api/metrics", async (req, res) => {
    try {
      const data = insertMetricSchema.parse(req.body);
      const metric = await storage.insertMetrics(data);
      res.status(201).json(metric);
    } catch (error) {
      res.status(400).json({ message: "Invalid metric data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}