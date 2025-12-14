import { cn } from "@/lib/utils/style";

interface Props {
  fields: string[];
  selected: string[];
  onToggle: (field: string) => void;
}

export function FieldMultiSelect({ fields, selected, onToggle }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Fields</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {fields.map((field) => {
          const isSelected = selected.includes(field);
          return (
            <button
              key={field}
              type="button"
              onClick={() => onToggle(field)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition",
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800",
              )}
            >
              {field}
            </button>
          );
        })}
      </div>
      {fields.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No fields available.</p>
      ) : null}
    </div>
  );
}


