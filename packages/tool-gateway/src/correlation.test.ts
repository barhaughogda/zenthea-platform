import * as assert from 'assert';
import { ToolExecutionGateway } from './gateway';
import { 
  IToolTelemetryLogger, 
  IGovernanceLogger, 
  ToolGatewayEvent, 
  GovernanceControlResult,
  IToolAuditLogger,
  ToolAuditLog
} from './types';
import { generatePolicySnapshot } from './governance';

class MockTelemetryLogger implements IToolTelemetryLogger {
  events: ToolGatewayEvent[] = [];
  async emit(event: ToolGatewayEvent): Promise<void> {
    this.events.push(event);
  }
}

class MockGovernanceLogger implements IGovernanceLogger {
  results: GovernanceControlResult[] = [];
  async emit(event: GovernanceControlResult): Promise<void> {
    this.results.push(event);
  }
}

class MockAuditLogger implements IToolAuditLogger {
  logs: ToolAuditLog[] = [];
  async log(event: ToolAuditLog): Promise<void> {
    this.logs.push(event);
  }
}

async function testSnapshotCorrelation() {
  console.log('Running Snapshot Correlation tests...');

  const telemetryLogger = new MockTelemetryLogger();
  const governanceLogger = new MockGovernanceLogger();
  const auditLogger = new MockAuditLogger();

  const gateway = new ToolExecutionGateway(auditLogger, telemetryLogger, governanceLogger);
  
  // Calculate expected hash (it should match what the gateway generates)
  const expectedHash = generatePolicySnapshot().policyHash;

  // 1. Valid request - Test Telemetry Correlation
  const validCommand = {
    commandId: '550e8400-e29b-41d4-a716-446655440000',
    proposalId: '550e8400-e29b-41d4-a716-446655440001',
    tenantId: 'tenant-1',
    agentId: 'patient-portal-agent',
    agentVersion: '1.0.0',
    tool: { name: 'medical_advisor.getAdvice', version: '1.0.0' },
    parameters: { patientId: 'actor-1' },
    approval: {
      approvedBy: 'actor-1',
      approvedAt: new Date().toISOString(),
      approvalType: 'human'
    },
    idempotencyKey: 'key-1',
    metadata: { correlationId: 'corr-1' }
  };

  const getCtx = (actorId: string = 'actor-1') => ({
    traceId: 'trace-1',
    actorId,
    policyVersion: '1.0.0'
  });

  await gateway.execute(validCommand, getCtx());

  const telemetryEvent = telemetryLogger.events[0];
  assert.ok(telemetryEvent, 'Should have emitted a telemetry event');
  assert.strictEqual(telemetryEvent.policySnapshotHash, expectedHash, 'Telemetry should include the active policy snapshot hash');
  assert.strictEqual(telemetryEvent.agentVersion, '1.0.0', 'Telemetry should include agent version');
  assert.strictEqual(telemetryEvent.decision, 'allowed', 'Telemetry should include decision');
  console.log('✅ Telemetry correlation passed');

  // 2. Denied request - Test Governance Correlation
  const invalidCommand = {
    ...validCommand,
    commandId: '550e8400-e29b-41d4-a716-446655440002',
    agentId: 'unknown-agent'
  };

  await gateway.execute(invalidCommand, getCtx());

  const governanceResult = governanceLogger.results[0];
  assert.ok(governanceResult, 'Should have emitted a governance result');
  assert.strictEqual(governanceResult.policySnapshotHash, expectedHash, 'Governance result should include the active policy snapshot hash');
  assert.strictEqual(governanceResult.agentVersion, '1.0.0', 'Governance result should include agent version');
  assert.strictEqual(governanceResult.decision, 'DENIED', 'Governance result should include decision');
  assert.strictEqual(governanceResult.reasonCode, 'UNKNOWN_AGENT', 'Governance result should include reason code');
  
  const telemetryEventDenied = telemetryLogger.events[1];
  assert.strictEqual(telemetryEventDenied.policySnapshotHash, expectedHash, 'Denied telemetry should also include snapshot hash');
  assert.strictEqual(telemetryEventDenied.decision, 'denied', 'Denied telemetry should show denied decision');
  console.log('✅ Governance correlation passed');

  // 3. Lifecycle Warning - Test Warning Correlation
  const deprecatedCommand = {
    ...validCommand,
    commandId: '550e8400-e29b-41d4-a716-446655440003',
    agentId: 'test-agent',
    agentVersion: 'deprecated-v1',
    tool: { name: 'chat.getHistory', version: '1.0.0' },
  };

  await gateway.execute(deprecatedCommand, getCtx());

  const warningResult = governanceLogger.results.find(r => r.decision === 'WARNING');
  assert.ok(warningResult, 'Should have emitted a governance warning');
  assert.strictEqual(warningResult.policySnapshotHash, expectedHash, 'Warning should include snapshot hash');
  assert.strictEqual(warningResult.agentVersion, 'deprecated-v1', 'Warning should include correct agent version');
  assert.strictEqual(warningResult.reasonCode, 'DEPRECATED_AGENT');
  console.log('✅ Lifecycle warning correlation passed');

  console.log('All Snapshot Correlation tests passed!');
}

testSnapshotCorrelation().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
