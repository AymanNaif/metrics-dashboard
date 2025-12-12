"use client";

import { AnnotationsPanel } from "@/components/AnnotationsPanel";
import { DatasetList } from "@/components/DatasetList";
import { FieldMultiSelect } from "@/components/FieldMultiSelect";
import { MetricsChart } from "@/components/MetricsChart";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { createAnnotation, deleteAnnotation } from "@/lib/api/annotations";
import { fetchDatasets } from "@/lib/api/datasets";
import { fetchMetrics } from "@/lib/api/metrics";
import type { ApiError, DatasetStatus } from "@/lib/api/types";
import { PresetRange, rangeFromPreset } from "@/lib/utils/time";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DatasetStatus | "all">("all");
  const debouncedSearch = useDebouncedValue(search, 350);

  const datasetsQuery = useQuery({
    queryKey: ["datasets", debouncedSearch, status],
    queryFn: () => fetchDatasets({ search: debouncedSearch, status }),
  });

  const datasets = useMemo(
    () => datasetsQuery.data?.datasets ?? [],
    [datasetsQuery.data?.datasets]
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDataset = useMemo(() => {
    if (selectedId) {
      const match = datasets.find((d) => d.id === selectedId);
      if (match) return match;
    }
    return datasets[0] ?? null;
  }, [datasets, selectedId]);

  const [preset, setPreset] = useState<PresetRange>("2h");
  const [range, setRange] = useState(() => {
    const [from, to] = rangeFromPreset("2h");
    return { from, to };
  });

  const handlePresetChange = (value: PresetRange) => {
    setPreset(value);
    if (value !== "custom") {
      const [from, to] = rangeFromPreset(value);
      setRange({ from, to });
    }
  };

  const handleCustomRangeChange = (from: number, to: number) => {
    setPreset("custom");
    const normalizedFrom = Math.min(from, to);
    const normalizedTo = Math.max(from, to);
    setRange({ from: normalizedFrom, to: normalizedTo });
  };

  const [selectedFieldsState, setSelectedFieldsState] = useState<string[]>([]);
  const selectedFields = useMemo(() => {
    if (!selectedDataset) return [];
    const valid = selectedFieldsState.filter((field) =>
      selectedDataset.fields.includes(field)
    );
    if (valid.length > 0) return valid;
    return selectedDataset.fields.slice(0, 3);
  }, [selectedDataset, selectedFieldsState]);

  const fieldsParam = selectedFields.join(",");

  const metricsQuery = useQuery({
    queryKey: [
      "metrics",
      selectedDataset?.id,
      range.from,
      range.to,
      fieldsParam,
    ],
    queryFn: () =>
      fetchMetrics({
        dataset: selectedDataset!.id,
        from: range.from,
        to: range.to,
        fields: fieldsParam,
      }),
    enabled: Boolean(selectedDataset?.id && selectedFields.length > 0),
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAnnotation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metrics"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnotation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["metrics"] }),
  });

  const metricsError =
    (metricsQuery.error as ApiError | undefined)?.message ||
    (metricsQuery.error ? "Failed to load metrics" : undefined);

  const datasetFields = selectedDataset?.fields ?? [];

  const annotations = metricsQuery.data?.annotations ?? [];

  const onToggleField = (field: string) => {
    setSelectedFieldsState((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleCreateAnnotation = (timestamp: number, text: string) => {
    if (!selectedDataset) return;
    createMutation.mutate({ dataset_id: selectedDataset.id, timestamp, text });
  };

  const handleDeleteAnnotation = (id: string) => {
    deleteMutation.mutate(id);
  };

  const defaultAnnotationTs = useMemo(
    () => metricsQuery.data?.to ?? range.to,
    [metricsQuery.data?.to, range.to]
  );

  return (
    <main className="grid lg:grid-cols-[360px_1fr] grid-cols-1 lg:p-0 p-6">
      <aside className="h-full lg:px-0 px-6">
        <DatasetList
          datasets={datasetsQuery.data?.datasets ?? []}
          selectedId={selectedDataset?.id}
          search={search}
          status={status}
          isLoading={datasetsQuery.isLoading}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onSelect={(dataset) => setSelectedId(dataset.id)}
        />
      </aside>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">
            Metrics Dashboard
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            REST API-driven time-series explorer
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Browse datasets, slice time ranges, visualize multiple fields, and
            annotate events. All data flows through a dedicated API service
            layer with robust error handling.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px,1fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TimeRangeSelector
                preset={preset}
                from={range.from}
                to={range.to}
                onPresetChange={handlePresetChange}
                onCustomRangeChange={handleCustomRangeChange}
              />
              <FieldMultiSelect
                fields={datasetFields}
                selected={selectedFields}
                onToggle={onToggleField}
              />
            </div>

            <MetricsChart
              data={metricsQuery.data}
              selectedFields={selectedFields}
              isLoading={metricsQuery.isLoading}
              error={metricsError}
            />

            <AnnotationsPanel
              datasetId={selectedDataset?.id}
              annotations={annotations}
              defaultTimestamp={defaultAnnotationTs}
              onCreate={handleCreateAnnotation}
              onDelete={handleDeleteAnnotation}
              isCreating={createMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
