export class FilterOptionDto {
  value: string;
  label: string;
}

export class FiltersResponseDto {
  platforms: FilterOptionDto[];
  fields: FilterOptionDto[];
  seniorities: FilterOptionDto[];
  locations: FilterOptionDto[];
}
