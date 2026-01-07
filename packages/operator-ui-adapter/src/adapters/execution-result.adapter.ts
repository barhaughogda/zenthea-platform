import { ExecutionResultDto } from '@starter/tool-gateway';
import { ExecutionResultUiModel, ExecutionStatus } from '../models/execution-ui.model';

export function adaptExecutionResultDtoToUiModel(dto: ExecutionResultDto): ExecutionResultUiModel {
  const outcomeMapping: Record<ExecutionResultDto['outcome'], { status: ExecutionStatus; label: string; severity: 'success' | 'warning' | 'error' }> = {
    ALLOWED: { status: 'success', label: 'Allowed', severity: 'success' },
    REJECTED: { status: 'denied', label: 'Rejected', severity: 'warning' },
    ERROR: { status: 'failure', label: 'Error', severity: 'error' },
  };

  const outcome = outcomeMapping[dto.outcome];

  return {
    executionId: dto.executionId,
    targetId: dto.id,
    targetType: dto.kind,
    status: {
      code: outcome.status,
      label: outcome.label,
      severity: outcome.severity,
    },
    message: dto.resultSummary.message,
    matchCount: dto.resultSummary.count,
    pagination: {
      hasNextPage: dto.pageInfo.hasNextPage,
      totalCount: dto.pageInfo.count,
      pageSize: dto.pageInfo.limit,
    },
    executedAt: dto.timestamp,
    trackingId: dto.correlationId,
  };
}
