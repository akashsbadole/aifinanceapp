import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  delta,
  icon,
  className,
}) => {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-lg sm:text-xl xl:text-2xl font-bold">{value}</div>
        {delta && (
          <p
            className={cn(
              "mt-1 text-xs sm:text-sm",
              delta.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {delta.isPositive ? "↑" : "↓"} {Math.abs(delta.value)}%
            <span className="text-muted-foreground ml-1 hidden sm:inline">
              from last month
            </span>
            <span className="text-muted-foreground ml-1 sm:hidden">
              vs last month
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
