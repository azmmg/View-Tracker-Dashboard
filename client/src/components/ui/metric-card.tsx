import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, HelpCircle } from "lucide-react";

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  change: number;
  isLoading?: boolean;
}

function getPerformanceColor(change: number): string {
  if (change >= 10) return "text-emerald-500"; // Good performance
  if (change >= 0) return "text-amber-500";    // Neutral performance
  return "text-red-500";                       // Poor performance
}

function getPerformanceLabel(change: number): string {
  if (change >= 10) return "Strong growth";
  if (change >= 0) return "Steady";
  return "Needs attention";
}

export function MetricCard({ title, icon, value, change, isLoading }: MetricCardProps) {
  const isPositive = change >= 0;
  const performanceColor = getPerformanceColor(change);
  const performanceLabel = getPerformanceLabel(change);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[100px]" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-[120px] mb-2" />
          <Skeleton className="h-4 w-[80px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "transition-colors duration-200",
      { "border-l-4": true },
      change >= 10 ? "border-l-emerald-500" : 
      change >= 0 ? "border-l-amber-500" : 
      "border-l-red-500"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className={cn("h-4 w-4", performanceColor)} />
            ) : (
              <TrendingDown className={cn("h-4 w-4", performanceColor)} />
            )}
            <p className={cn(
              "text-sm",
              performanceColor
            )}>
              {Math.abs(change)}% from last week
            </p>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Status: {performanceLabel}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ≥10%: Strong growth<br />
                  0-9%: Steady<br />
                  &lt;0%: Needs attention
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}