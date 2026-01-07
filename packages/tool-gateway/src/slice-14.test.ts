import * as assert from 'assert';
import { OperatorAPI } from './operator-api';
import { 
  IGovernanceTimelineReader, 
  GovernanceTimelineEvent 
} from './timeline';
import { 
  AgentRegistryReader
} from './agent-registry';
import { TimelineRegistryJoiner } from './timeline-registry-join';
import { 
  IOperatorAuditEmitter, 
  OperatorAuditEvent 
} from './types';
import { 
  ExecutionResultDtoSchema, 
  OperatorAuditDtoSchema,
  PolicyDtoSchema,
  ViewDtoSchema
} from './operator-dtos';

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  async query(): Promise<GovernanceTimelineEvent[]> {
    return [
      { 
        eventId: '1', 
        timestamp: new Date().toISOString(), 
        type: 'TOOL_GATEWAY', 
        decision: 'denied',
        toolName: 'test-tool',
        agentVersion: '1.0.0',
        policySnapshotHash: 'hash-1',
        actorType: 'patient'
      }
    ];
  }
  async getEvent(): Promise<GovernanceTimelineEvent | null> {
    return null;
  }
}

/**
 * Mock Audit Emitter for testing.
 */
class MockOperatorAuditEmitter implements IOperatorAuditEmitter {
  public emittedEvents: OperatorAuditEvent[] = [];

  async emit(event: OperatorAuditEvent): Promise<void> {
    this.emittedEvents.push(event);
  }
}

async function testSlice14() {
  console.log('Running Slice 14 (Control Plane DTOs) tests...');

  const timelineReader = new MockTimelineReader();
  const registryReader = new AgentRegistryReader();
  const joiner = new TimelineRegistryJoiner(registryReader);
  const mockAuditEmitter = new MockOperatorAuditEmitter();
  
  const api = new OperatorAPI(
    timelineReader, 
    registryReader, 
    joiner,
    mockAuditEmitter
  );

  // 1. DTO Schema Validation - Rejects forbidden fields
  console.log('Testing DTO schema validation...');
  const invalidResult = {
    version: 'v1',
    executionId: '550e8400-e29b-41d4-a716-446655440000',
    kind: 'policy',
    id: 'test-policy',
    outcome: 'ALLOWED',
    resultSummary: { message: 'Success', count: 10 },
    pageInfo: { hasNextPage: false, count: 10, limit: 50 },
    timestamp: new Date().toISOString(),
    tenantId: 'forbidden-tenant', // FORBIDDEN
  };
  const resultParse = ExecutionResultDtoSchema.safeParse(invalidResult);
  assert.strictEqual(resultParse.success, false, 'ExecutionResultDtoSchema should reject tenantId');

  const invalidAudit = {
    version: 'v1',
    eventId: '550e8400-e29b-41d4-a716-446655440000',
    action: 'POLICY_EXECUTE',
    outcome: 'ALLOWED',
    target: 'test-policy',
    timestamp: new Date().toISOString(),
    metadata: {
      targetType: 'timeline',
    },
    payload: { sensitive: 'data' }, // FORBIDDEN
  };
  const auditParse = OperatorAuditDtoSchema.safeParse(invalidAudit);
  assert.strictEqual(auditParse.success, false, 'OperatorAuditDtoSchema should reject payload');
  console.log('✅ DTO schema validation passed');

  // 2. listPolicies returns valid DTOs
  console.log('Testing listPolicies...');
  const policies = api.listPolicies();
  assert.ok(policies.length > 0);
  policies.forEach(p => {
    const pResult = PolicyDtoSchema.safeParse(p);
    assert.strictEqual(pResult.success, true, `Policy ${p.policyId} should be a valid DTO`);
    assert.strictEqual(p.version, 'v1');
  });
  console.log('✅ listPolicies passed');

  // 3. listViews returns valid DTOs
  console.log('Testing listViews...');
  const views = api.listViews();
  assert.ok(views.length > 0);
  views.forEach(v => {
    const vResult = ViewDtoSchema.safeParse(v);
    assert.strictEqual(vResult.success, true, `View ${v.viewId} should be a valid DTO`);
    assert.strictEqual(v.version, 'v1');
  });
  console.log('✅ listViews passed');

  // 4. executePolicy returns ExecutionResultDto and doesn't leak results
  console.log('Testing executePolicy DTO output...');
  const execResult = await api.executePolicy('recent-denied-tools');
  const execValidation = ExecutionResultDtoSchema.safeParse(execResult);
  assert.strictEqual(execValidation.success, true, 'executePolicy should return a valid ExecutionResultDto');
  assert.strictEqual(execResult.outcome, 'ALLOWED');
  assert.strictEqual(execResult.kind, 'policy');
  assert.strictEqual(execResult.id, 'recent-denied-tools');
  
  // Security check: ensure no data or cursors leaked
  const rawResult = execResult as unknown as Record<string, unknown>;
  assert.strictEqual(rawResult.items, undefined, 'ExecutionResultDto must NOT contain items');
  assert.strictEqual(rawResult.nextCursor, undefined, 'ExecutionResultDto must NOT contain nextCursor');
  assert.strictEqual(rawResult.tenantId, undefined, 'ExecutionResultDto must NOT contain tenantId');
  console.log('✅ executePolicy DTO output passed');

  // 5. executeView routes through executePolicy
  console.log('Testing executeView routing...');
  const viewExecResult = await api.executeView('clinical-overview');
  assert.strictEqual(viewExecResult.kind, 'view');
  assert.strictEqual(viewExecResult.id, 'clinical-overview');
  assert.strictEqual(viewExecResult.outcome, 'ALLOWED');
  console.log('✅ executeView routing passed');

  console.log('All Slice 14 tests passed! 🎯');
}

testSlice14().catch(err => {
  console.error('❌ Slice 14 Tests failed:');
  console.error(err);
  process.exit(1);
});
