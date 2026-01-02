import { Loader2 } from "lucide-react";
import type { Job } from "@/types/job";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
}

export function JobList({ jobs, isLoading, error }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">
            Failed to load jobs
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <p className="text-foreground font-medium mb-2">No jobs found</p>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Found{" "}
          <span className="font-medium text-foreground">{jobs.length}</span>{" "}
          jobs
        </p>
      </div>
      {jobs.map((job, index) => (
        <JobCard key={`${job.link}-${index}`} job={job} />
      ))}
    </div>
  );
}
