import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metric } from "@shared/schema";

interface MetricComparisonProps {
  metric: 'views' | 'visits' | 'visitors';
  today: Metric;
  lastWeek: Metric;
  title: string;
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

function getPerformanceColor(change: number): string {
  if (change >= 10) return "text-emerald-500";
  if (change >= 0) return "text-amber-500";
  return "text-red-500";
}

export function MetricComparison({ metric, today, lastWeek, title }: MetricComparisonProps) {
  const currentValue = today[metric];
  const previousValue = lastWeek[metric];
  const percentChange = calculatePercentChange(currentValue, previousValue);
  const isPositive = percentChange >= 0;
  const performanceColor = getPerformanceColor(percentChange);

  const chartData = [
    {
      name: 'Last Week',
      value: previousValue,
    },
    {
      name: 'Today',
      value: currentValue,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Compare</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title} Comparison</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Period Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Change Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Today</p>
                  <p className="text-2xl font-bold">{currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Week</p>
                  <p className="text-2xl font-bold">{previousValue.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {isPositive ? (
                    <TrendingUp className={cn("h-4 w-4", performanceColor)} />
                  ) : (
                    <TrendingDown className={cn("h-4 w-4", performanceColor)} />
                  )}
                  <span className={cn("text-sm font-medium", performanceColor)}>
                    {Math.abs(percentChange)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
