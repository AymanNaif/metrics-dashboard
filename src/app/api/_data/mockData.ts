import type {
  Annotation,
  Dataset,
  DatasetStatus,
  MetricDatapoint,
  MetricsResponse,
} from "@/lib/api/types";

const baseDatasets: Dataset[] = [
  {
    id: "ds_1",
    name: "Production API",
    status: "active",
    description: "Main production metrics",
    fields: ["REQUESTS", "ERRORS", "P50_LATENCY", "P95_LATENCY", "P99_LATENCY"],
  },
  {
    id: "ds_2",
    name: "Analytics Pipeline",
    status: "active",
    description: "Events ingestion and processing",
    fields: ["INGESTED", "PROCESSED", "FAILED", "LAG_MS"],
  },
  {
    id: "ds_3",
    name: "Edge CDN",
    status: "inactive",
    description: "Edge cache and delivery metrics",
    fields: ["HITS", "MISSES", "ERROR_RATE", "CACHE_FILL"],
  },
];

let annotations: Annotation[] = [
  {
    id: "ann_1",
    dataset_id: "ds_1",
    timestamp: Math.floor(Date.now() / 1000) - 45 * 60,
    text: "Deploy v2.3",
  },
  {
    id: "ann_2",
    dataset_id: "ds_1",
    timestamp: Math.floor(Date.now() / 1000) - 3 * 60 * 60,
    text: "Hotfix API gateway",
  },
];

export function listDatasets(search?: string, status?: DatasetStatus | "all") {
  const query = (search ?? "").toLowerCase();

  return baseDatasets.filter((dataset) => {
    const matchesStatus =
      status && status !== "all" ? dataset.status === status : true;
    const matchesQuery =
      query.length === 0 ||
      dataset.name.toLowerCase().includes(query) ||
      dataset.description?.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });
}

function randomValue(seed: number, multiplier = 1) {
  const x = Math.sin(seed) * 10_000;
  return (x - Math.floor(x)) * multiplier;
}

function generateSeriesPoint(
  field: string,
  timestamp: number,
  datasetId: string
): number {
  const base = randomValue(timestamp + datasetId.length, 1);

  switch (field) {
    case "REQUESTS":
      return Math.round(900 + base * 50);
    case "ERRORS":
      return Math.round(10 + base * 5);
    case "P50_LATENCY":
      return parseFloat((40 + base * 4).toFixed(2));
    case "P95_LATENCY":
      return parseFloat((75 + base * 8).toFixed(2));
    case "P99_LATENCY":
      return parseFloat((110 + base * 12).toFixed(2));
    case "INGESTED":
      return Math.round(2_500 + base * 200);
    case "PROCESSED":
      return Math.round(2_300 + base * 180);
    case "FAILED":
      return Math.round(15 + base * 8);
    case "LAG_MS":
      return Math.round(500 + base * 120);
    case "HITS":
      return Math.round(3_000 + base * 250);
    case "MISSES":
      return Math.round(300 + base * 50);
    case "ERROR_RATE":
      return parseFloat((1 + base * 0.5).toFixed(2));
    case "CACHE_FILL":
      return parseFloat((80 + base * 10).toFixed(2));
    default:
      return Math.round(100 + base * 10);
  }
}

export function generateMetrics(
  datasetId: string,
  from: number,
  to: number,
  fields: string[]
): MetricsResponse {
  const duration = Math.max(to - from, 1);
  const step = Math.max(Math.floor(duration / 60), 60); // aim for <= 60 points

  const datapoints: MetricDatapoint[] = [];
  for (let ts = from; ts <= to; ts += step) {
    const point: MetricDatapoint = { timestamp: ts };
    fields.forEach((field) => {
      point[field] = generateSeriesPoint(field, ts, datasetId);
    });
    datapoints.push(point);
  }

  return {
    dataset_id: datasetId,
    from,
    to,
    datapoints,
    annotations: annotations.filter((a) => a.dataset_id === datasetId),
  };
}

export function createAnnotationEntry(
  input: Omit<Annotation, "id">
): Annotation {
  const annotation: Annotation = {
    ...input,
    id: crypto.randomUUID(),
  };
  annotations = [...annotations, annotation];
  return annotation;
}

export function deleteAnnotationEntry(id: string) {
  annotations = annotations.filter((a) => a.id !== id);
}
