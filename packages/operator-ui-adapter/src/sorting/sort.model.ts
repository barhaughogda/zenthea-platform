export type SortDirection = 'asc' | 'desc';

export interface SortUiModel {
  field: string;
  direction: SortDirection;
}
