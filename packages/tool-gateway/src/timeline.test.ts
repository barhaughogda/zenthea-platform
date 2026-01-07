/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';
import { 
  ToolGatewayEvent, 
  GovernanceControlResult, 
  ApprovalSignal 
} from './types';
import { TransitionEvent } from './lifecycle-telemetry';
import { TimelineAggregator, GovernanceTimelineEvent } from './timeline';

function testToolGatewayAggregation() {
  console.log('Running ToolGateway aggregation tests...');
  const policySnapshotHash = 'hash-123';
  const agentVersion = '1.0.0';
  const timestamp = new Date().toISOString();

  const event: ToolGatewayEvent = {
    toolName: 'chat.sendMessage', // Allowlisted
    tenantId: 'tenant-123', // Forbidden
    actorId: 'actor-123',   // Forbidden
    actorType: 'patient',
    agentVersion,
    policySnapshotHash,
    requestId: 'req-123',   // Forbidden
    idempotencyKeyHash: 'hash-abc', // Forbidden
    decision: 'allowed',
    latencyMs: 100,
    timestamp,
  };

  const timelineEvent = TimelineAggregator.fromToolGateway(event);

  assert.strictEqual(timelineEvent.type, 'TOOL_GATEWAY');
  assert.strictEqual(timelineEvent.eventId, 'req-123');
  assert.strictEqual(timelineEvent.policySnapshotHash, policySnapshotHash);
  assert.strictEqual(timelineEvent.agentVersion, agentVersion);
  assert.strictEqual(timelineEvent.timestamp, timestamp);
  assert.strictEqual(timelineEvent.toolName, 'chat.sendMessage');
  assert.strictEqual(timelineEvent.actorType, 'patient');
  assert.strictEqual(timelineEvent.decision, 'allowed');

  // Forbidden fields should NOT be present
  assert.strictEqual((timelineEvent as any).tenantId, undefined);
  assert.strictEqual((timelineEvent as any).actorId, undefined);
  assert.strictEqual((timelineEvent as any).requestId, undefined);
  assert.strictEqual((timelineEvent as any).idempotencyKeyHash, undefined);
  assert.strictEqual((timelineEvent as any).latencyMs, undefined);
  console.log('✅ ToolGateway aggregation passed');
}

function testUnknownToolMapping() {
  console.log('Running unknown tool mapping tests...');
  const event: ToolGatewayEvent = {
    toolName: 'forbiddenTool', // Not in allowlist
    tenantId: 't',
    actorId: 'a',
    actorType: 'system',
    agentVersion: 'v',
    policySnapshotHash: 'h',
    requestId: 'r',
    idempotencyKeyHash: 'k',
    decision: 'denied',
    latencyMs: 0,
    timestamp: 't',
  };

  const timelineEvent = TimelineAggregator.fromToolGateway(event);
  assert.strictEqual(timelineEvent.toolName, 'unknown_tool', 'Forbidden toolName should be mapped to unknown_tool');

  const govEvent: GovernanceControlResult = {
    decision: 'DENIED',
    reasonCode: 'SCOPE_DENIED',
    toolName: 'secret.hack',
    agentType: 'clinical',
    agentVersion: 'v',
    policySnapshotHash: 'h',
    timestamp: 't',
  };
  const timelineGovEvent = TimelineAggregator.fromGovernanceControl(govEvent);
  assert.strictEqual(timelineGovEvent.toolName, 'unknown_tool', 'Governance toolName should also be mapped');
  console.log('✅ Unknown tool mapping passed');
}

function testGovernanceControlAggregation() {
  console.log('Running GovernanceControl aggregation tests...');
  const policySnapshotHash = 'hash-123';
  const agentVersion = '1.0.0';
  const timestamp = new Date().toISOString();

  const event: GovernanceControlResult = {
    decision: 'DENIED',
    reasonCode: 'RATE_LIMITED',
    toolName: 'createConsent', // Allowlisted
    agentType: 'clinical',
    agentVersion,
    policySnapshotHash,
    timestamp,
  };

  const timelineEvent = TimelineAggregator.fromGovernanceControl(event);

  assert.strictEqual(timelineEvent.type, 'GOVERNANCE_CONTROL');
  assert.strictEqual(timelineEvent.decision, 'DENIED');
  assert.strictEqual(timelineEvent.reasonCode, 'RATE_LIMITED');
  assert.strictEqual(timelineEvent.toolName, 'createConsent');
  assert.strictEqual(timelineEvent.agentType, 'clinical');
  console.log('✅ GovernanceControl aggregation passed');
}

function testApprovalSignalAggregation() {
  console.log('Running ApprovalSignal aggregation tests...');
  const policySnapshotHash = 'hash-123';
  const agentVersion = '1.0.0';
  const timestamp = new Date().toISOString();

  const event: ApprovalSignal = {
    triggerType: 'RATE_LIMITED',
    severity: 'high',
    escalationLevel: 2,
    agentVersion,
    policySnapshotHash,
    timestamp,
  };

  const timelineEvent = TimelineAggregator.fromApprovalSignal(event);

  assert.strictEqual(timelineEvent.type, 'APPROVAL_SIGNAL');
  assert.strictEqual(timelineEvent.triggerType, 'RATE_LIMITED');
  assert.strictEqual(timelineEvent.severity, 'high');
  assert.strictEqual(timelineEvent.escalationLevel, 2);
  console.log('✅ ApprovalSignal aggregation passed');
}

function testTransitionAggregation() {
  console.log('Running Transition aggregation tests...');
  const policySnapshotHash = 'hash-123';
  const agentVersion = '1.0.0';
  const timestamp = new Date().toISOString();

  const event: TransitionEvent = {
    agentVersion,
    fromState: 'active',
    toState: 'deprecated',
    decision: 'approved',
    policySnapshotHash,
    timestamp,
  };

  const timelineEvent = TimelineAggregator.fromTransition(event);

  assert.strictEqual(timelineEvent.type, 'LIFECYCLE_TRANSITION');
  assert.strictEqual(timelineEvent.fromState, 'active');
  assert.strictEqual(timelineEvent.toState, 'deprecated');
  assert.strictEqual(timelineEvent.decision, 'approved');
  console.log('✅ Transition aggregation passed');
}

function testNoForbiddenFieldsExist() {
  console.log('Running forbidden fields absence tests...');
  const timestamp = new Date().toISOString();
  
  // Create a timeline event and verify NO additional fields exist beyond the interface
  const event: ToolGatewayEvent = {
    toolName: 'chat.sendMessage',
    tenantId: 'tenant-PII',
    actorId: 'actor-PII',
    actorType: 'patient',
    agentVersion: 'v1',
    policySnapshotHash: 'h1',
    requestId: 'req-PII',
    idempotencyKeyHash: 'key-PII',
    decision: 'allowed',
    latencyMs: 123,
    timestamp,
  };

  const timelineEvent = TimelineAggregator.fromToolGateway(event);
  const keys = Object.keys(timelineEvent);
  
  const forbiddenKeys = ['tenantId', 'actorId', 'requestId', 'idempotencyKeyHash', 'agentId', 'payload', 'latencyMs'];
  for (const forbidden of forbiddenKeys) {
    assert.strictEqual(keys.includes(forbidden), false, `Timeline event must NOT contain ${forbidden}`);
  }
  console.log('✅ No forbidden fields exist passed');
}

function testSorting() {
  console.log('Running sorting tests...');
  const events: any[] = [
    { eventId: '1', timestamp: '2025-01-01T12:00:00Z' },
    { eventId: '2', timestamp: '2025-01-01T10:00:00Z' },
    { eventId: '3', timestamp: '2025-01-01T11:00:00Z' },
  ];

  const sorted = TimelineAggregator.sortChronologically(events as GovernanceTimelineEvent[]);

  assert.strictEqual(sorted[0].timestamp, '2025-01-01T10:00:00Z');
  assert.strictEqual(sorted[1].timestamp, '2025-01-01T11:00:00Z');
  assert.strictEqual(sorted.length, 3);
  console.log('✅ Sorting passed');
}

try {
  testToolGatewayAggregation();
  testUnknownToolMapping();
  testGovernanceControlAggregation();
  testApprovalSignalAggregation();
  testTransitionAggregation();
  testNoForbiddenFieldsExist();
  testSorting();
  console.log('All hardened Governance Timeline tests passed!');
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
