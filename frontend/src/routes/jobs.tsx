import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { JobSearch } from "@/components/JobSearch";
import { JobList } from "@/components/JobList";
import { fetchJobs } from "@/api/jobs";
import type { Job, JobSearchParams } from "@/types/job";

interface JobsSearchParams {
  field?: string;
  seniority?: string;
  q?: string;
}

export const Route = createFileRoute("/jobs")({
  validateSearch: (search: Record<string, unknown>): JobsSearchParams => {
    return {
      field: (search.field as string) || undefined,
      seniority: (search.seniority as string) || undefined,
      q: (search.q as string) || undefined,
    };
  },
  component: JobsPage,
});

function JobsPage() {
  const { field, seniority, q } = Route.useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (filters: {
    query: string;
    field: string;
    seniority: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: JobSearchParams = {
        field: filters.field,
        seniority: filters.seniority,
      };
      const results = await fetchJobs(params);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load jobs based on URL search params
  useEffect(() => {
    handleSearch({
      query: q || "",
      field: field || "all",
      seniority: seniority || "all",
    });
  }, [field, seniority, q]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Search Section */}
      <section className="relative py-8 px-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <JobSearch
            initialField={field}
            initialSeniority={seniority}
            initialQuery={q}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Job Results Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <JobList jobs={jobs} isLoading={isLoading} error={error} />
        </div>
      </section>
    </div>
  );
}
