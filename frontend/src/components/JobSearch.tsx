import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchFilters } from "@/api/jobs";
import type { FilterOption } from "@/types/job";

interface JobSearchProps {
  initialPlatform?: string;
  initialField?: string;
  initialSeniority?: string;
  initialLocation?: string;
  initialQuery?: string;
  /** If provided, will call this instead of navigating */
  onSearch?: (filters: {
    query: string;
    platform: string;
    field: string;
    seniority: string;
    location: string;
  }) => void;
}

export function JobSearch({
  initialPlatform,
  initialField,
  initialSeniority,
  initialLocation,
  initialQuery,
  onSearch,
}: JobSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery || "");
  const [platform, setPlatform] = useState(initialPlatform || "helloworld");
  const [field, setField] = useState(initialField || "all");
  const [seniority, setSeniority] = useState(initialSeniority || "all");
  const [location, setLocation] = useState(initialLocation || "all");
  const [platforms, setPlatforms] = useState<FilterOption[]>([]);
  const [fields, setFields] = useState<FilterOption[]>([]);
  const [seniorities, setSeniorities] = useState<FilterOption[]>([]);
  const [locations, setLocations] = useState<FilterOption[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await fetchFilters();
        setPlatforms(filters.platforms);
        setFields(filters.fields);
        setSeniorities(filters.seniorities);
        setLocations(filters.locations);
      } catch (error) {
        console.error("Failed to load filters:", error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  // Update local state when initial props change (for URL-based updates)
  useEffect(() => {
    if (initialPlatform !== undefined)
      setPlatform(initialPlatform || "helloworld");
  }, [initialPlatform]);

  useEffect(() => {
    if (initialField !== undefined) setField(initialField || "all");
  }, [initialField]);

  useEffect(() => {
    if (initialSeniority !== undefined) setSeniority(initialSeniority || "all");
  }, [initialSeniority]);

  useEffect(() => {
    if (initialLocation !== undefined) setLocation(initialLocation || "all");
  }, [initialLocation]);

  useEffect(() => {
    if (initialQuery !== undefined) setQuery(initialQuery || "");
  }, [initialQuery]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ query, platform, field, seniority, location });
    } else {
      // Navigate to jobs page with search params
      const searchParams: Record<string, string> = {};
      if (platform) searchParams.platform = platform;
      if (field && field !== "all") searchParams.field = field;
      if (seniority && seniority !== "all") searchParams.seniority = seniority;
      if (location && location !== "all") searchParams.location = location;
      if (query) searchParams.q = query;

      navigate({
        to: "/jobs",
        search: searchParams,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 h-12 text-base bg-background/50 border-border/50 focus:border-primary"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select
                value={platform}
                onValueChange={setPlatform}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className="h-11 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={field}
                onValueChange={setField}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className="h-11 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {fields.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={seniority}
                onValueChange={setSeniority}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className="h-11 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {seniorities.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={location}
                onValueChange={setLocation}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className="h-11 bg-background/50 border-border/50">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSearch}
              size="lg"
              className="h-11 px-8 bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
