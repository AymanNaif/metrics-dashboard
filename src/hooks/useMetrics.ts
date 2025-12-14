import useFetchData from "@/hooks/useFetchData";
import { fetchMetrics } from "@/lib/api/metrics";
import type { ApiError, MetricsResponse } from "@/lib/api/types";

interface UseMetricsProps {
  datasetId?: string;
  from: number;
  to: number;
  fields: string[];
}

export function useMetrics({ datasetId, from, to, fields }: UseMetricsProps) {
  const fieldsParam = fields.join(",");

  const query = useFetchData<MetricsResponse>({
    queryKey: ["metrics", datasetId, from, to, fieldsParam],
    request: () =>
      fetchMetrics({
        dataset: datasetId!,
        from,
        to,
        fields: fieldsParam,
      }),
    options: {
      enabled: Boolean(datasetId && fields.length > 0),
    },
  });

  const error =
    (query.error as ApiError | undefined)?.message ||
    (query.error ? "Failed to load metrics" : undefined);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error,
  };
}
