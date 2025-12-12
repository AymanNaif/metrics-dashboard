import axios from "axios";
import type { ApiError } from "./types";

const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  // Place to inject auth tokens or correlation IDs later.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message;

    const apiError: ApiError = {
      status,
      message:
        serverMessage ||
        (status === 404
          ? "Resource not found."
          : "Something went wrong. Please try again."),
      details: error?.response?.data,
    };

    return Promise.reject(apiError);
  },
);


