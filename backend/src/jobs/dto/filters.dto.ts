export class FilterOptionDto {
  value: string;
  label: string;
}

export class FiltersResponseDto {
  fields: FilterOptionDto[];
  seniorities: FilterOptionDto[];
}
