import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import useFetchData from "@/hooks/useFetchData";
import { fetchDatasets } from "@/lib/api/datasets";
import type { DatasetStatus, DatasetsResponse } from "@/lib/api/types";
import { useMemo, useState } from "react";

export function useDatasets() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DatasetStatus | "all">("all");
  const debouncedSearch = useDebouncedValue(search, 350);

  const query = useFetchData<DatasetsResponse>({
    queryKey: ["datasets", debouncedSearch, status],
    request: () => fetchDatasets({ search: debouncedSearch, status }),
  });

  const datasets = useMemo(
    () => query.data?.datasets ?? [],
    [query.data?.datasets]
  );

  return {
    datasets,
    isLoading: query.isLoading,
    search,
    status,
    setSearch,
    setStatus,
  };
}
