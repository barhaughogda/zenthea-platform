import { SortUiModel } from '../sorting/sort.model';

export type RiskSeverity = 'low' | 'medium' | 'high';

export interface PolicyUiModel {
  id: string;
  label: string;
  summary: string;
  categoryLabel: string;
  risk: {
    tier: RiskSeverity;
    label: string;
    colorHint: 'info' | 'warning' | 'error';
  };
  presentation: {
    iconName?: string;
    layoutType: 'table' | 'list' | 'grid';
    columnDefinitions: Array<{ key: string; label: string }>;
    defaultSorting?: SortUiModel;
    badges: string[];
  };
  parameterSchema?: Array<{
    id: string;
    label: string;
    dataType: string;
    hint: string;
  }>;
  outputSchema?: Array<{
    id: string;
    label: string;
    dataType: string;
    hint: string;
  }>;
  externalLinks: Array<{
    title: string;
    href: string;
  }>;
}
