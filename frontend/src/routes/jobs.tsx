import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JobSearch } from "@/components/JobSearch";
import { JobList } from "@/components/JobList";
import { Button } from "@/components/ui/button";
import { fetchJobs } from "@/api/jobs";
import type { Job, JobSearchParams } from "@/types/job";

interface JobsSearchParams {
  platform?: string;
  field?: string;
  seniority?: string;
  location?: string;
  page?: number;
  q?: string;
}

export const Route = createFileRoute("/jobs")({
  validateSearch: (search: Record<string, unknown>): JobsSearchParams => {
    return {
      platform: (search.platform as string) || "helloworld",
      field: (search.field as string) || undefined,
      seniority: (search.seniority as string) || undefined,
      location: (search.location as string) || undefined,
      page: search.page ? Number(search.page) : 1,
      q: (search.q as string) || undefined,
    };
  },
  component: JobsPage,
});

function JobsPage() {
  const navigate = useNavigate();
  const { platform, field, seniority, location, page, q } = Route.useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentPage = page || 1;

  const handleSearch = async (filters: {
    query: string;
    platform: string;
    field: string;
    seniority: string;
    location: string;
  }) => {
    // Reset to page 1 when filters change
    const searchParams: Record<string, string | number> = {
      platform: filters.platform,
    };
    if (filters.field && filters.field !== "all")
      searchParams.field = filters.field;
    if (filters.seniority && filters.seniority !== "all")
      searchParams.seniority = filters.seniority;
    if (filters.location && filters.location !== "all")
      searchParams.location = filters.location;
    if (filters.query) searchParams.q = filters.query;

    navigate({
      to: "/jobs",
      search: searchParams,
    });
  };

  const handlePageChange = (newPage: number) => {
    const searchParams: Record<string, string | number> = {
      platform: platform || "helloworld",
    };
    if (field) searchParams.field = field;
    if (seniority) searchParams.seniority = seniority;
    if (location) searchParams.location = location;
    if (q) searchParams.q = q;
    if (newPage > 1) searchParams.page = newPage;

    navigate({
      to: "/jobs",
      search: searchParams,
    });
  };

  // Load jobs based on URL search params
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params: JobSearchParams = {
          platform: platform || "helloworld",
          q: q,
          field: field,
          seniority: seniority,
          location: location,
          page: currentPage,
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

    loadJobs();
  }, [platform, q, field, seniority, location, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Search Section */}
      <section className="relative py-8 px-6 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <JobSearch
            initialPlatform={platform}
            initialField={field}
            initialSeniority={seniority}
            initialLocation={location}
            initialQuery={q}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Job Results Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <JobList jobs={jobs} isLoading={isLoading} error={error} />

          {/* Pagination */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={jobs.length < 30} // Disable if likely last page
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
