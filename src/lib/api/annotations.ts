import { apiClient } from "./client";
import type { Annotation } from "./types";

export interface CreateAnnotationPayload {
  dataset_id: string;
  timestamp: number;
  text: string;
}

export async function createAnnotation(
  payload: CreateAnnotationPayload,
): Promise<Annotation> {
  const response = await apiClient.post<Annotation>("/api/annotations", payload);
  return response.data;
}

export async function deleteAnnotation(id: string): Promise<void> {
  await apiClient.delete(`/api/annotations/${id}`);
}


