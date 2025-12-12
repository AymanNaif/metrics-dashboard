import type { Dataset, DatasetStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils/style";
import { SearchIcon } from "./icons";

interface Props {
  datasets: Dataset[];
  selectedId?: string;
  search: string;
  status: DatasetStatus | "all";
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: DatasetStatus | "all") => void;
  onSelect: (dataset: Dataset) => void;
}

export function DatasetList({
  datasets,
  selectedId,
  search,
  status,
  isLoading,
  onSearchChange,
  onStatusChange,
  onSelect,
}: Props) {
  return (
    <div className="rounded-xl border h-full border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-9 text-sm outline-none ring-2 ring-transparent transition focus:border-slate-300 focus:ring-slate-200"
            placeholder="Search datasets"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200"
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as DatasetStatus | "all")
          }
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4 space-y-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 animate-pulse rounded-lg border border-slate-100 bg-slate-100"
              />
            ))
          : null}

        {!isLoading && datasets.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
            No datasets found
          </div>
        ) : null}

        {!isLoading &&
          datasets.map((dataset) => (
            <button
              key={dataset.id}
              type="button"
              onClick={() => onSelect(dataset)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition",
                "hover:border-slate-300 hover:bg-slate-50",
                selectedId === dataset.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-slate-900">{dataset.name}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                    dataset.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : dataset.status === "inactive"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-slate-100 text-slate-700"
                  )}
                >
                  {dataset.status}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {dataset.description}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Fields: {dataset.fields.join(", ")}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}
