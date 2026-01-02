import { Building2, MapPin, Clock, ExternalLink } from "lucide-react";
import type { Job } from "@/types/job";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
        job.inactive && "opacity-60"
      )}
    >
      {job.inactive && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
            Inactive
          </span>
        </div>
      )}

      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-14 h-14 rounded-lg object-cover bg-background border border-border/50"
            />
          ) : (
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>

          <p className="text-muted-foreground font-medium mt-1">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {job.posted}
            </span>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
              {job.tags.length > 4 && (
                <span className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  +{job.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Apply Button */}
        <div className="flex-shrink-0 self-center">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary rounded-lg transition-colors"
          >
            Apply
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
