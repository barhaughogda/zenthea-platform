export interface AuditEventUiModel {
  id: string;
  eventType: 'policy_execution' | 'view_execution';
  outcome: {
    isAllowed: boolean;
    label: string;
    severity: 'success' | 'warning';
  };
  targetId: string;
  targetCategory: 'timeline' | 'agentRegistry';
  timestamp: string;
  reason?: string;
}
