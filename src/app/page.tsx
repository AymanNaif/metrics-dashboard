"use client";

import { DatasetList } from "@/components/DatasetList";
import { MainDashboard } from "@/components/MainDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="grid lg:grid-cols-[360px_1fr] grid-cols-1 lg:p-0 p-2">
      <aside className="h-full lg:px-0 px-3">
        <DatasetList />
      </aside>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-2 lg:p-6 w-full">
        <header className="flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:p-6">
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-500">
              Metrics Dashboard
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              REST API-driven time-series explorer
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
              Browse datasets, slice time ranges, visualize multiple fields, and
              annotate events. All data flows through a dedicated API service
              layer with robust error handling.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <MainDashboard />
      </div>
    </main>
  );
}
