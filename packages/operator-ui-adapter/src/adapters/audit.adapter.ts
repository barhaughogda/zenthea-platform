import { OperatorAuditDto } from '@starter/tool-gateway';
import { AuditEventUiModel } from '../models/audit-ui.model';

export function adaptAuditDtoToUiModel(dto: OperatorAuditDto): AuditEventUiModel {
  const isAllowed = dto.outcome === 'ALLOWED';

  return {
    id: dto.eventId,
    eventType: dto.action === 'POLICY_EXECUTE' ? 'policy_execution' : 'view_execution',
    outcome: {
      isAllowed,
      label: isAllowed ? 'Allowed' : 'Rejected',
      severity: isAllowed ? 'success' : 'warning',
    },
    targetId: dto.target,
    targetCategory: dto.metadata.targetType,
    timestamp: dto.timestamp,
    reason: dto.reasonCode,
  };
}
