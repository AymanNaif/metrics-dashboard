import { useDashboard } from "@/context/DashboardContext";
import { useDatasets } from "@/hooks/useDatasets";
import { DatasetStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils/style";
import { Search } from "lucide-react";
import { useEffect } from "react";

export function DatasetList() {
  const { datasets, search, status, isLoading, setSearch, setStatus } = useDatasets();
  const { selectedDataset, setSelectedDataset } = useDashboard();

  useEffect(() => {
    if (!selectedDataset && datasets.length > 0) {
      setSelectedDataset(datasets[0]);
    }
  }, [datasets, selectedDataset, setSelectedDataset]);

  return (
    <div className="rounded-xl border h-full border-slate-200 bg-white p-3 md:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-9 text-sm outline-none ring-2 ring-transparent transition focus:border-slate-300 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-slate-700 dark:focus:ring-slate-800"
            placeholder="Search datasets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-700 dark:focus:ring-slate-800"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as DatasetStatus | "all")
          }
        >
          <option value="all" className="dark:bg-slate-950">All</option>
          <option value="active" className="dark:bg-slate-950">Active</option>
          <option value="inactive" className="dark:bg-slate-950">Inactive</option>
          <option value="archived" className="dark:bg-slate-950">Archived</option>
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 animate-pulse rounded-lg border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800"
            />
          ))
          : null}

        {!isLoading && datasets.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No datasets found
          </div>
        ) : null}

        {!isLoading &&
          datasets.map((dataset) => (
            <button
              key={dataset.id}
              type="button"
              onClick={() => setSelectedDataset(dataset)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 md:px-4 md:py-3 text-left transition",
                "hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800",
                selectedDataset?.id === dataset.id
                  ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-900 dark:text-slate-100">{dataset.name}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                    dataset.status === "active"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : dataset.status === "inactive"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  {dataset.status}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                {dataset.description}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                Fields: {dataset.fields.join(", ")}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}
