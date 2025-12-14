"use client";

import { AnnotationsPanel } from "@/components/AnnotationsPanel";
import { FieldMultiSelect } from "@/components/FieldMultiSelect";
import { MetricsChart } from "@/components/MetricsChart";
import { TimeRangeSelector } from "@/components/TimeRangeSelector";
import { useDashboard } from "@/context/DashboardContext";
import { useAnnotationActions } from "@/hooks/useAnnotationActions";
import { useMetrics } from "@/hooks/useMetrics";
import { useMemo } from "react";

export function MainDashboard() {
  const {
    selectedDataset,
    range,
    setPreset,
    setCustomRange,
    preset,
    selectedFields,
    availableFields,
    toggleField,
  } = useDashboard();

  const { data: metricsData, isLoading: isMetricsLoading, error: metricsError } = useMetrics({
    datasetId: selectedDataset?.id,
    from: range.from,
    to: range.to,
    fields: selectedFields,
  });

  const { create, remove, isCreating, isDeleting } = useAnnotationActions({
    datasetId: selectedDataset?.id,
  });

  const annotations = metricsData?.annotations ?? [];
  const defaultAnnotationTs = metricsData?.to ?? range.to;

  const handleCreateAnnotation = (timestamp: number, text: string) => {
    create(timestamp, text);
  };

  const handleDeleteAnnotation = (id: string) => {
    remove(id);
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px,1fr]">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <TimeRangeSelector
            preset={preset}
            from={range.from}
            to={range.to}
            onPresetChange={setPreset}
            onCustomRangeChange={setCustomRange}
          />
          <FieldMultiSelect
            fields={availableFields}
            selected={selectedFields}
            onToggle={toggleField}
          />
        </div>

        <MetricsChart
          data={metricsData}
          selectedFields={selectedFields}
          isLoading={isMetricsLoading}
          error={metricsError}
        />

        <AnnotationsPanel
          datasetId={selectedDataset?.id}
          annotations={annotations}
          defaultTimestamp={defaultAnnotationTs}
          onCreate={handleCreateAnnotation}
          onDelete={handleDeleteAnnotation}
          isCreating={isCreating}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
