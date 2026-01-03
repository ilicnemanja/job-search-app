import type { Job, JobSearchParams, FiltersResponse } from "@/types/job";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchJobs(params?: JobSearchParams): Promise<Job[]> {
  const searchParams = new URLSearchParams();

  if (params?.platform && params.platform !== "all") {
    searchParams.set("platform", params.platform);
  }
  if (params?.q) {
    searchParams.set("q", params.q);
  }
  if (params?.field && params.field !== "all") {
    searchParams.set("field", params.field);
  }
  if (params?.seniority && params.seniority !== "all") {
    searchParams.set("seniority", params.seniority);
  }
  if (params?.page && params.page > 1) {
    searchParams.set("page", params.page.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFilters(): Promise<FiltersResponse> {
  const url = `${API_BASE_URL}/jobs/filters`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch filters: ${response.statusText}`);
  }

  return response.json();
}
