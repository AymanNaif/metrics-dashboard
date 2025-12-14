"use client";

import type { Dataset } from "@/lib/api/types";
import { PresetRange, rangeFromPreset } from "@/lib/utils/time";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface DashboardContextValue {
  selectedDataset: Dataset | null;
  setSelectedDataset: (dataset: Dataset | null) => void;

  preset: PresetRange;
  range: { from: number; to: number };
  setPreset: (preset: PresetRange) => void;
  setCustomRange: (from: number, to: number) => void;

  selectedFields: string[];
  toggleField: (field: string) => void;
  availableFields: string[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

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

  const [rawSelectedFields, setRawSelectedFields] = useState<string[]>([]);

  const availableFields = useMemo(
    () => selectedDataset?.fields ?? [],
    [selectedDataset]
  );

  const selectedFields = useMemo(() => {
    if (!selectedDataset) return [];

    const valid = rawSelectedFields.filter((field) =>
      availableFields.includes(field)
    );

    if (valid.length > 0) return valid;
    return availableFields.slice(0, 3);
  }, [availableFields, rawSelectedFields, selectedDataset]);


  const toggleField = (field: string) => {
    setRawSelectedFields((prev) => {

      const currentEffective = selectedFields;

      if (currentEffective.includes(field)) {
        return currentEffective.filter((f) => f !== field);
      } else {
        return [...currentEffective, field];
      }
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedDataset,
        setSelectedDataset,
        preset,
        range,
        setPreset: handlePresetChange,
        setCustomRange: handleCustomRangeChange,
        selectedFields,
        toggleField,
        availableFields,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
