import type { Annotation } from "@/lib/api/types";
import { fromDateTimeLocalInput, toDateTimeLocalInput } from "@/lib/utils/time";
import { cn } from "@/lib/utils/style";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "./icons";

interface Props {
  datasetId?: string;
  annotations: Annotation[];
  defaultTimestamp: number;
  onCreate: (timestamp: number, text: string) => void;
  onDelete: (id: string) => void;
  isCreating: boolean;
  isDeleting: boolean;
}

export function AnnotationsPanel({
  datasetId,
  annotations,
  defaultTimestamp,
  onCreate,
  onDelete,
  isCreating,
  isDeleting,
}: Props) {
  const [text, setText] = useState("");
  const [timestamp, setTimestamp] = useState(
    toDateTimeLocalInput(defaultTimestamp),
  );

  useEffect(() => {
    setTimestamp(toDateTimeLocalInput(defaultTimestamp));
  }, [defaultTimestamp]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!datasetId || !text.trim()) return;
    onCreate(fromDateTimeLocalInput(timestamp), text.trim());
    setText("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Annotations</p>
        <span className="text-xs text-slate-500">{annotations.length} total</span>
      </div>

      <form className="mt-3 space-y-2" onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200"
          disabled={!datasetId}
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Deploy v2.3"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-2 ring-transparent transition hover:border-slate-300 focus:ring-slate-200 disabled:bg-slate-50"
            disabled={!datasetId}
          />
          <button
            type="submit"
            disabled={!datasetId || text.trim().length === 0 || isCreating}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white transition",
              "bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300",
            )}
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </button>
        </div>
      </form>

      <div className="mt-3 space-y-2">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">{annotation.text}</p>
              <p className="text-xs text-slate-500">
                {format(annotation.timestamp * 1000, "PPpp")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDelete(annotation.id)}
              className="rounded-md p-1 text-slate-500 transition hover:bg-slate-200"
              disabled={isDeleting}
              aria-label="Delete annotation"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        {annotations.length === 0 ? (
          <p className="text-sm text-slate-500">No annotations yet.</p>
        ) : null}
      </div>
    </div>
  );
}


