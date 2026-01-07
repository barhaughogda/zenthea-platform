import { describe, it, expect } from 'vitest';
import { PolicyDto, ViewDto, ExecutionResultDto, OperatorAuditDto } from '@starter/tool-gateway';
import { 
  adaptPolicyDtoToUiModel, 
  adaptViewDtoToUiModel, 
  adaptExecutionResultDtoToUiModel, 
  adaptAuditDtoToUiModel 
} from '../index';

describe('Slice 15: Operator UI Adapter (Headless)', () => {
  const mockTimestamp = new Date().toISOString();

  describe('Policy Adapter', () => {
    it('should transform PolicyDto to PolicyUiModel correctly', () => {
      const dto: PolicyDto = {
        version: 'v1',
        policyId: 'pol_123',
        name: 'High Risk Access',
        description: 'Test policy',
        category: 'Access Control',
        riskTier: 'high',
        presentation: {
          icon: 'shield',
          layout: 'table',
          columns: [{ key: 'id', label: 'ID' }],
          badges: ['RESTRICTED'],
        },
        inputs: [{ name: 'userId', type: 'string', description: 'User ID' }],
        links: [{ label: 'Docs', url: 'https://docs.example.com' }],
      };

      const ui = adaptPolicyDtoToUiModel(dto);

      expect(ui.id).toBe(dto.policyId);
      expect(ui.label).toBe(dto.name);
      expect(ui.risk.tier).toBe('high');
      expect(ui.risk.label).toBe('High Risk');
      expect(ui.risk.colorHint).toBe('error');
      expect(ui.presentation.iconName).toBe('shield');
      expect(ui.presentation.layoutType).toBe('table');
      expect(ui.presentation.badges).toContain('RESTRICTED');
      expect(ui.parameterSchema?.[0].id).toBe('userId');
      expect(ui.externalLinks[0].title).toBe('Docs');
    });

    it('should handle missing optional fields gracefully', () => {
      const dto: PolicyDto = {
        version: 'v1',
        policyId: 'pol_min',
        name: 'Min Policy',
        description: 'Minimal',
        category: 'General',
        riskTier: 'low',
        presentation: {},
      };

      const ui = adaptPolicyDtoToUiModel(dto);
      expect(ui.presentation.layoutType).toBe('table'); // default
      expect(ui.presentation.columnDefinitions).toEqual([]);
      expect(ui.externalLinks).toEqual([]);
      expect(ui.parameterSchema).toBeUndefined();
    });
  });

  describe('View Adapter', () => {
    it('should transform ViewDto to ViewUiModel correctly', () => {
      const dto: ViewDto = {
        version: 'v1',
        viewId: 'view_456',
        name: 'My Custom View',
        description: 'Personal view',
        policyId: 'pol_123',
        presentation: {
          icon: 'list',
          badges: ['PERSONAL'],
        },
      };

      const ui = adaptViewDtoToUiModel(dto);

      expect(ui.id).toBe(dto.viewId);
      expect(ui.parentPolicyId).toBe(dto.policyId);
      expect(ui.presentation.iconName).toBe('list');
      expect(ui.presentation.badges).toContain('PERSONAL');
    });
  });

  describe('Execution Result Adapter', () => {
    it('should transform ExecutionResultDto to ExecutionResultUiModel correctly', () => {
      const dto: ExecutionResultDto = {
        version: 'v1',
        executionId: '00000000-0000-0000-0000-000000000001',
        kind: 'policy',
        id: 'pol_123',
        outcome: 'ALLOWED',
        resultSummary: {
          message: 'Found 10 items',
          count: 10,
        },
        pageInfo: {
          hasNextPage: true,
          count: 100,
          limit: 10,
        },
        timestamp: mockTimestamp,
        correlationId: 'corr_123',
      };

      const ui = adaptExecutionResultDtoToUiModel(dto);

      expect(ui.executionId).toBe(dto.executionId);
      expect(ui.status.code).toBe('success');
      expect(ui.status.label).toBe('Allowed');
      expect(ui.status.severity).toBe('success');
      expect(ui.pagination.hasNextPage).toBe(true);
      expect(ui.pagination.totalCount).toBe(100);
      expect(ui.pagination.pageSize).toBe(10);
      expect(ui.trackingId).toBe('corr_123');
    });

    it('should handle REJECTED outcome correctly', () => {
      const dto: ExecutionResultDto = {
        version: 'v1',
        executionId: '00000000-0000-0000-0000-000000000002',
        kind: 'view',
        id: 'view_456',
        outcome: 'REJECTED',
        resultSummary: { message: 'Access Denied', count: 0 },
        pageInfo: { hasNextPage: false, count: 0, limit: 10 },
        timestamp: mockTimestamp,
      };

      const ui = adaptExecutionResultDtoToUiModel(dto);
      expect(ui.status.code).toBe('denied');
      expect(ui.status.severity).toBe('warning');
    });
  });

  describe('Audit Adapter', () => {
    it('should transform OperatorAuditDto to AuditEventUiModel correctly', () => {
      const dto: OperatorAuditDto = {
        version: 'v1',
        eventId: '00000000-0000-0000-0000-000000000003',
        action: 'POLICY_EXECUTE',
        outcome: 'ALLOWED',
        target: 'pol_123',
        timestamp: mockTimestamp,
        metadata: {
          targetType: 'timeline',
        },
      };

      const ui = adaptAuditDtoToUiModel(dto);

      expect(ui.id).toBe(dto.eventId);
      expect(ui.eventType).toBe('policy_execution');
      expect(ui.outcome.isAllowed).toBe(true);
      expect(ui.outcome.severity).toBe('success');
      expect(ui.targetCategory).toBe('timeline');
    });
  });

  describe('Security Constraints', () => {
    it('should never expose forbidden fields', () => {
      const auditDto: OperatorAuditDto = {
        version: 'v1',
        eventId: '00000000-0000-0000-0000-000000000004',
        action: 'POLICY_EXECUTE',
        outcome: 'REJECTED',
        target: 'pol_123',
        timestamp: mockTimestamp,
        metadata: {
          targetType: 'timeline',
          policySnapshotHash: 'secret_hash',
        },
      };

      const ui = adaptAuditDtoToUiModel(auditDto);
      
      // forbidden fields should not be present in UI model
      const uiAny = ui as unknown as Record<string, unknown>;
      expect(uiAny.policySnapshotHash).toBeUndefined();
      expect(uiAny.tenantId).toBeUndefined();
    });
  });
});
