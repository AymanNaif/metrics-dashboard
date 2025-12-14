import { fromDateTimeLocalInput, toDateTimeLocalInput } from "@/lib/utils/time";
import type { PresetRange } from "@/lib/utils/time";
import { cn } from "@/lib/utils/style";

interface Props {
  preset: PresetRange;
  from: number;
  to: number;
  onPresetChange: (preset: PresetRange) => void;
  onCustomRangeChange: (from: number, to: number) => void;
}

const presets: Array<{ label: string; value: PresetRange }> = [
  { label: "30m", value: "30m" },
  { label: "2h", value: "2h" },
  { label: "24h", value: "24h" },
  { label: "Custom", value: "custom" },
];

export function TimeRangeSelector({
  preset,
  from,
  to,
  onPresetChange,
  onCustomRangeChange,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onPresetChange(item.value)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition",
              preset === item.value
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {preset === "custom" ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex flex-col text-xs font-semibold text-slate-500 dark:text-slate-400">
            From
            <input
              type="datetime-local"
              value={toDateTimeLocalInput(from)}
              onChange={(e) => onCustomRangeChange(fromDateTimeLocalInput(e.target.value), to)}
              className="mt-1 h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-700 dark:focus:ring-slate-800"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold text-slate-500 dark:text-slate-400">
            To
            <input
              type="datetime-local"
              value={toDateTimeLocalInput(to)}
              onChange={(e) => onCustomRangeChange(from, fromDateTimeLocalInput(e.target.value))}
              className="mt-1 h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-700 dark:focus:ring-slate-800"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}


