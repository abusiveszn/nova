"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<string, any>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function ChartContainer({ id, className, children, config, ...props }: any) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle(_: { id: string; config: ChartConfig }) {
  return null;
}

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent(props: any) {
  const { active, payload, className } = props;
  if (!active || !payload?.length) return null;

  return (
    <div className={cn("bg-background border p-2 text-xs", className)}>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex justify-between">
          <span>{p.name ?? p.dataKey ?? "value"}</span>
          <span>{String(p.value ?? p.payload?.value ?? "")}</span>
        </div>
      ))}
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent(props: any) {
  const { className, payload, hideIcon } = props;
  if (!payload?.length) return null;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {payload.map((item: any) => (
        <div key={String(item.value)} className="flex items-center gap-2">
          {!hideIcon && (
            <div style={{ width: 12, height: 12, background: item.color }} />
          )}
          <span>{item.payload?.name ?? item.name ?? item.dataKey}</span>
        </div>
      ))}
    </div>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
