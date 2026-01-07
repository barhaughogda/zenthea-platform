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
  ExecutionResultDtoSchema, 
  ExecutionResultDtoV2Schema,
} from './operator-dtos';
import { DefaultEscalationPolicy } from './escalation/default-escalation-policy';
import { DecisionDtoSchema } from './operator-decision-dtos';

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  constructor(private readonly shouldError = false) {}

  async query(): Promise<GovernanceTimelineEvent[]> {
    if (this.shouldError) {
      throw new Error('Database Error');
    }
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

async function testSlice16() {
  console.log('Running Slice 16 (Escalation & Decision Hooks) tests...');

  const timelineReader = new MockTimelineReader();
  const registryReader = new AgentRegistryReader();
  const joiner = new TimelineRegistryJoiner(registryReader);
  const escalationPolicy = new DefaultEscalationPolicy();
  
  const api = new OperatorAPI(
    timelineReader, 
    registryReader, 
    joiner,
    undefined, // Use default audit emitter
    escalationPolicy
  );

  // 1. Safety & Determinism - V2 Schema validation
  console.log('Testing V2 DTO schema validation...');
  const validV2Result = {
    version: 'v2',
    executionId: '550e8400-e29b-41d4-a716-446655440000',
    kind: 'policy',
    id: 'test-policy',
    outcome: 'REJECTED',
    resultSummary: { message: 'Rejected', count: 0 },
    pageInfo: { hasNextPage: false, count: 0, limit: 50 },
    timestamp: new Date().toISOString(),
    decision: {
      kind: 'SECURITY_REVIEW',
      severity: 'critical',
      reasonCode: 'HIGH_RISK_REJECTION',
      message: 'High-risk rejection detected.'
    }
  };
  const v2Parse = ExecutionResultDtoV2Schema.safeParse(validV2Result);
  assert.strictEqual(v2Parse.success, true, 'ExecutionResultDtoV2Schema should accept valid decision');

  const invalidV2Result = {
    ...validV2Result,
    decision: {
      ...validV2Result.decision,
      tenantId: 'forbidden-tenant', // FORBIDDEN
    }
  };
  const invalidV2Parse = ExecutionResultDtoV2Schema.safeParse(invalidV2Result);
  assert.strictEqual(invalidV2Parse.success, false, 'ExecutionResultDtoV2Schema should reject forbidden fields in decision');
  console.log('✅ V2 DTO schema validation passed');

  // 2. Backward Compatibility - executePolicy returns V1 DTO
  console.log('Testing CP-14 compatibility (executePolicy)...');
  const v1Result = await api.executePolicy('recent-denied-tools');
  assert.strictEqual(v1Result.version, 'v1');
  const v1Validation = ExecutionResultDtoSchema.safeParse(v1Result);
  assert.strictEqual(v1Validation.success, true, 'executePolicy should still return valid V1 DTO');
  console.log('✅ CP-14 compatibility passed');

  // 3. New Functionality - executePolicyV2 returns V2 DTO with Decision
  console.log('Testing executePolicyV2 with escalation...');
  // 'critical-security-audits' is riskTier: 'high'
  
  const apiWithError = new OperatorAPI(
    new MockTimelineReader(true),
    registryReader,
    joiner,
    undefined,
    escalationPolicy
  );
  
  const highRiskErrorResult = await apiWithError.executePolicyV2('critical-security-audits');
  assert.strictEqual(highRiskErrorResult.outcome, 'ERROR');
  assert.ok(highRiskErrorResult.decision, 'High-risk rejection should trigger a decision');
  assert.strictEqual(highRiskErrorResult.decision?.kind, 'SECURITY_REVIEW');
  assert.strictEqual(highRiskErrorResult.decision?.severity, 'critical');
  console.log('✅ High-risk rejection triggers SECURITY_REVIEW');

  // 4. Policy Misconfig triggers COMPLIANCE_REVIEW
  console.log('Testing policy misconfiguration escalation...');
  // Unknown policy ID triggers ERROR with UNKNOWN_POLICY_ID
  const misconfigResult = await api.executePolicyV2('invalid-policy-id');
  assert.strictEqual(misconfigResult.outcome, 'ERROR');
  assert.strictEqual(misconfigResult.reasonCode, 'UNKNOWN_POLICY_ID');
  assert.ok(misconfigResult.decision, 'Policy misconfig should trigger a decision');
  assert.strictEqual(misconfigResult.decision?.kind, 'COMPLIANCE_REVIEW');
  assert.strictEqual(misconfigResult.decision?.severity, 'warning');
  console.log('✅ Policy misconfig triggers COMPLIANCE_REVIEW');

  // 5. Normal execution returns no decision
  console.log('Testing normal execution (no decision)...');
  const normalResult = await api.executePolicyV2('active-clinical-agents');
  assert.strictEqual(normalResult.outcome, 'ALLOWED');
  assert.strictEqual(normalResult.decision, undefined, 'Normal execution should not trigger a decision');
  console.log('✅ Normal execution returns no decision');

  console.log('All Slice 16 tests passed! 🎯');
}

testSlice16().catch(err => {
  console.error('❌ Slice 16 Tests failed:');
  console.error(err);
  process.exit(1);
});
