export interface Job {
  title: string;
  company: string;
  location: string;
  posted: string;
  link: string;
  tags: string[];
  companyLogo: string;
  inactive: boolean;
}

export interface JobSearchParams {
  field?: string;
  seniority?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FiltersResponse {
  fields: FilterOption[];
  seniorities: FilterOption[];
}
