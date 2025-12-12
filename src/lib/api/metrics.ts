import { apiClient } from "./client";
import type { MetricsResponse } from "./types";

export interface MetricsQueryParams {
  dataset: string;
  from: number;
  to: number;
  fields: string;
}

export async function fetchMetrics(
  params: MetricsQueryParams,
): Promise<MetricsResponse> {
  const response = await apiClient.get<MetricsResponse>("/api/metrics", {
    params,
  });
  return response.data;
}


