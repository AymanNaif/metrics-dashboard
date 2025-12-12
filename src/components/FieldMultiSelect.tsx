import { cn } from "@/lib/utils/style";

interface Props {
  fields: string[];
  selected: string[];
  onToggle: (field: string) => void;
}

export function FieldMultiSelect({ fields, selected, onToggle }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">Fields</p>
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
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {field}
            </button>
          );
        })}
      </div>
      {fields.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">No fields available.</p>
      ) : null}
    </div>
  );
}


