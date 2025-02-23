import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Users, UserCheck } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import type { Metric } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MetricsResponse {
  today: Metric;
  lastWeek: Metric;
}

// Example function to insert metrics
async function insertMetric() {
  const now = new Date();
  const data = {
    date: now.toISOString(),
    views: Math.floor(Math.random() * 1000) + 500,
    visits: Math.floor(Math.random() * 800) + 400,
    visitors: Math.floor(Math.random() * 600) + 300
  };

  const response = await apiRequest("POST", "/api/metrics", data);
  return response.json();
}

function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function Dashboard() {
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery<MetricsResponse>({
    queryKey: ["/api/metrics"],
  });

  const mutation = useMutation({
    mutationFn: insertMetric,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "New metrics have been added",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add metrics",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard (React)</h1>
      <p class="mb-5 text-base text-gray-800">The entire dashboard was built by the AI assistant of Repl.it</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Views"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          value={data?.today.views ?? 0}
          change={calculatePercentChange(
            data?.today.views ?? 0,
            data?.lastWeek.views ?? 0
          )}
          metric="views"
          today={data?.today ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
          lastWeek={data?.lastWeek ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
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
          metric="visits"
          today={data?.today ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
          lastWeek={data?.lastWeek ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
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
          metric="visitors"
          today={data?.today ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
          lastWeek={data?.lastWeek ?? { id: 0, date: new Date(), views: 0, visits: 0, visitors: 0 }}
          isLoading={isLoading}
        />
      </div>

      <button 
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? "Adding..." : "Insert Sample Metrics"}
      </button>
    </div>
  );
}
