import { PaginationUiModel } from '../pagination/cursor.model';

export type ExecutionStatus = 'success' | 'denied' | 'failure';

export interface ExecutionResultUiModel {
  executionId: string;
  targetId: string;
  targetType: 'policy' | 'view';
  status: {
    code: ExecutionStatus;
    label: string;
    severity: 'success' | 'warning' | 'error';
  };
  message: string;
  matchCount: number;
  pagination: PaginationUiModel;
  executedAt: string;
  trackingId?: string;
}
