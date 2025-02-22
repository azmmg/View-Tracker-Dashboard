import { useQuery } from "@tanstack/react-query";
import { Eye, Users, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import type { Metric } from "@shared/schema";

interface MetricsResponse {
  today: Metric;
  lastWeek: Metric;
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function Dashboard() {
  const { data, isLoading } = useQuery<MetricsResponse>({
    queryKey: ["/api/metrics"],
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Views"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          value={data?.today.views ?? 0}
          change={calculatePercentChange(
            data?.today.views ?? 0,
            data?.lastWeek.views ?? 0
          )}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Visits"
          icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          value={data?.today.visits ?? 0}
          change={calculatePercentChange(
            data?.today.visits ?? 0,
            data?.lastWeek.visits ?? 0
          )}
          isLoading={isLoading}
        />
        
        <MetricCard
          title="Visitors"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={data?.today.visitors ?? 0}
          change={calculatePercentChange(
            data?.today.visitors ?? 0,
            data?.lastWeek.visitors ?? 0
          )}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
