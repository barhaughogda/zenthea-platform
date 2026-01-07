import { SortUiModel } from '../sorting/sort.model';

export interface ViewUiModel {
  id: string;
  label: string;
  summary: string;
  parentPolicyId: string;
  presentation: {
    iconName?: string;
    layoutType: 'table' | 'list' | 'grid';
    columnDefinitions: Array<{ key: string; label: string }>;
    defaultSorting?: SortUiModel;
    badges: string[];
  };
}
