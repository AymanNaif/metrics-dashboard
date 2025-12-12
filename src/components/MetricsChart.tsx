"use client";

import type { MetricsResponse } from "@/lib/api/types";
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
  const datapoints = data?.datapoints ?? [];
  const annotations = data?.annotations ?? [];

  if (error) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-red-600 shadow-sm">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[420px] animate-pulse rounded-xl border border-slate-200 bg-slate-100 shadow-sm" />
    );
  }

  if (!data || datapoints.length === 0) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm">
        Select a dataset and fields to load metrics.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{data.dataset_id}</p>
          <p className="text-xs text-slate-500">
            {format(data.from * 1000, "PP p")} - {format(data.to * 1000, "PP p")}
          </p>
        </div>
      </div>
      <div className="mt-2 h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datapoints} margin={{ top: 20, right: 24, left: 0, bottom: 5 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => format(Number(value) * 1000, "HH:mm")}
              stroke="#94a3b8"
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              labelFormatter={(value) => format(Number(value) * 1000, "PPpp")}
              contentStyle={{ borderRadius: 8 }}
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


