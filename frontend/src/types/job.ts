export interface Job {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
}

export interface JobSearchParams {
  platform?: string;
  q?: string;
  field?: string;
  seniority?: string;
  page?: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FiltersResponse {
  platforms: FilterOption[];
  fields: FilterOption[];
  seniorities: FilterOption[];
}
