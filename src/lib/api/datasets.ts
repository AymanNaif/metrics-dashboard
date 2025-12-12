import { apiClient } from "./client";
import type { DatasetsResponse, DatasetStatus } from "./types";

export interface DatasetQueryParams {
  search?: string;
  status?: DatasetStatus | "all";
}

export async function fetchDatasets(
  params: DatasetQueryParams,
): Promise<DatasetsResponse> {
  const response = await apiClient.get<DatasetsResponse>("/api/datasets", {
    params,
  });
  return response.data;
}


