import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Users, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import type { Metric } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface MetricsResponse {
  today: Metric;
  lastWeek: Metric;
}

// Example function to insert metrics
async function insertMetric() {
  const data = {
    date: new Date().toISOString(),
    views: 1500,
    visits: 800,
    visitors: 600
  };

  await apiRequest("POST", "/api/metrics", data);
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function Dashboard() {
  const { data, isLoading } = useQuery<MetricsResponse>({
    queryKey: ["/api/metrics"],
  });

  // Add mutation for inserting metrics
  const mutation = useMutation({
    mutationFn: insertMetric,
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

      {/* Add a button to test metric insertion */}
      <button 
        onClick={() => mutation.mutate()}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Insert Sample Metrics
      </button>
    </div>
  );
}