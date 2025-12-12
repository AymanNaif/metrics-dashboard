# REST API-Driven Metrics Dashboard

Responsive, TypeScript-first dashboard for exploring time-series metrics with dataset browsing, multi-field charting, and annotations. Everything is wired through a typed API service layer with axios interceptors and robust loading/error states.

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript (strict) + ESLint
- Tailwind CSS (v4)
- Axios service layer with interceptors
- TanStack React Query for data fetching/caching
- Recharts for charts
- date-fns for date formatting

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Project Structure
```
src/
  app/
    api/              # Mock REST routes (datasets, metrics, annotations)
    page.tsx          # Dashboard UI (client)
    providers.tsx     # React Query provider
  components/         # UI pieces (datasets list, selectors, chart, annotations)
  hooks/              # Reusable hooks (debounce)
  lib/
    api/              # Axios client + typed endpoints
    utils/            # Helpers (time, classnames)
```

## API Layer (axios)
- `src/lib/api/client.ts` sets base URL (`NEXT_PUBLIC_API_BASE_URL` → defaults to relative `/api`), JSON headers, timeout, and response interceptor that normalizes errors into a `ApiError` shape with user-friendly messages.
- Typed endpoint helpers:
  - `fetchDatasets({ search, status })`
  - `fetchMetrics({ dataset, from, to, fields })`
  - `createAnnotation({ dataset_id, timestamp, text })`
  - `deleteAnnotation(id)`

## Mock REST Endpoints
- `GET /api/datasets?search=&status=` — filters sample datasets with a small delay.
- `GET /api/metrics?dataset=&from=&to=&fields=` — returns generated time-series points per selected fields plus current annotations.
- `POST /api/annotations` — add annotation with `dataset_id`, `timestamp`, `text`.
- `DELETE /api/annotations/:id` — remove annotation.
Mock data lives in `src/app/api/_data/mockData.ts`.

## Features Implemented
- Dataset browser with debounced search, status filter, selection state, and loading skeletons.
- Time range presets (30m, 2h, 24h) + custom datetime inputs with normalization.
- Field multi-select (defaults to first 3 valid fields per dataset).
- Metrics visualization (Recharts) with multi-line chart, tooltips, legend, loading/error states.
- Annotation create/delete with inline form and chart markers (ReferenceLines with labels).
- Error boundary at app level and consistent empty/loading UX.
- Responsive layout (single-column on mobile, two-column on desktop).

## Decisions & Notes
- **Axios over fetch:** central interceptors, shared error normalization, and easy future auth header injection.
- **React Query:** caching + dedup + retries for API-centric workflows; devtools included.
- **Recharts:** lightweight, line-friendly, and SSR-compatible when used in client components.
- **Mock API vs. fixtures:** kept in Next API routes to mirror the REST contract and to allow swapping to a real backend by changing `NEXT_PUBLIC_API_BASE_URL`.

## Next Steps (if more time)
- Add tests (React Testing Library) for service layer and components.
- Add dark mode toggle and persisted UI state.
- Add inline validation for custom time ranges and annotation form.
