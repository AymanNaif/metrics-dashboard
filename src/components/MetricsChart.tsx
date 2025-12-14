"use client";

import type { MetricsResponse } from "@/lib/api/types";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const palette = ["#2563eb", "#7c3aed", "#0ea5e9", "#16a34a", "#f97316", "#dc2626"];

interface Props {
  data?: MetricsResponse;
  selectedFields: string[];
  isLoading: boolean;
  error?: string;
}

export function MetricsChart({ data, selectedFields, isLoading, error }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const datapoints = data?.datapoints ?? [];
  const annotations = data?.annotations ?? [];

  if (error) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-red-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="h-[420px] animate-pulse rounded-xl border border-slate-200 bg-slate-100 shadow-sm w-full dark:border-slate-800 dark:bg-slate-800" />
    );
  }

  if (!data) {
    return null;
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{data.dataset_id}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {format(data.from * 1000, "PP p")} - {format(data.to * 1000, "PP p")}
          </p>
        </div>
      </div>
      <div className="mt-2 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datapoints} margin={{ top: 20, right: 24, left: 0, bottom: 5 }}>
            <CartesianGrid stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => format(Number(value) * 1000, "HH:mm")}
              stroke="#94a3b8"
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              labelFormatter={(value) => format(Number(value) * 1000, "PPpp")}
              contentStyle={{
                borderRadius: 8,
                backgroundColor: isDark ? "#020617" : "#fff",
                borderColor: isDark ? "#1e293b" : "#ccc",
                color: isDark ? "#f8fafc" : "#0f172a",
              }}
            />
            <Legend />
            {selectedFields.map((field, idx) => (
              <Line
                key={field}
                type="monotone"
                dataKey={field}
                stroke={palette[idx % palette.length]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
            {annotations.map((annotation) => (
              <ReferenceLine
                key={annotation.id}
                x={annotation.timestamp}
                stroke="#f97316"
                strokeDasharray="4 4"
                label={{
                  value: annotation.text,
                  position: "top",
                  fill: "#f97316",
                  fontSize: 12,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


