export type DatasetStatus = "active" | "inactive" | "archived";

export interface Dataset {
  id: string;
  name: string;
  status: DatasetStatus;
  description?: string;
  fields: string[];
}

export interface DatasetsResponse {
  datasets: Dataset[];
}

export interface MetricDatapoint {
  timestamp: number;
  [field: string]: number | string | number[] | undefined;
}

export interface Annotation {
  id: string;
  dataset_id: string;
  timestamp: number;
  text: string;
}

export interface MetricsResponse {
  dataset_id: string;
  from: number;
  to: number;
  datapoints: MetricDatapoint[];
  annotations: Annotation[];
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}


