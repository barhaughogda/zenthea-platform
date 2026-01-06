import * as assert from 'assert';
import { ApprovalSignalEngine } from './approval';
import { 
  GovernanceControlResult, 
  ApprovalSignal, 
  IApprovalSignalEmitter 
} from './types';

/**
 * Tests for Approval Signal Engine mapping and emission fixes.
 */
function testApprovalSignals() {
  const signals: ApprovalSignal[] = [];
  const emitter: IApprovalSignalEmitter = {
    emitSignal: (signal) => signals.push(signal),
  };

  const engine = new ApprovalSignalEngine(emitter);

  console.log('Running ApprovalSignal fix tests...');

  // 1. RATE_LIMITED Fix: Must map to Level 2 (Medium Severity)
  const rateLimitEvent: GovernanceControlResult = {
    decision: 'DENIED',
    reasonCode: 'RATE_LIMITED',
    toolName: 'chat.sendMessage',
    agentType: 'clinical',
    agentVersion: '1.0.0',
    policySnapshotHash: 'hash123',
    timestamp: new Date().toISOString(),
  };

  engine.processGovernanceEvent(rateLimitEvent);
  assert.strictEqual(signals.length, 1);
  assert.strictEqual(signals[0].triggerType, 'RATE_LIMITED');
  assert.strictEqual(signals[0].severity, 'medium');
  assert.strictEqual(signals[0].escalationLevel, 2);
  console.log('✅ RATE_LIMITED fix passed (Level 2, Medium)');

  // 2. WARNING Filtering: DEPRECATED_AGENT + Write Tool -> Emit
  const warningWriteEvent: GovernanceControlResult = {
    decision: 'WARNING',
    reasonCode: 'DEPRECATED_AGENT',
    toolName: 'chat.sendMessage', // Write tool
    agentType: 'clinical',
    agentVersion: '1.0.0',
    policySnapshotHash: 'hash123',
    timestamp: new Date().toISOString(),
  };

  engine.processGovernanceEvent(warningWriteEvent);
  assert.strictEqual(signals.length, 2);
  assert.strictEqual(signals[1].triggerType, 'DEPRECATED_AGENT');
  assert.strictEqual(signals[1].severity, 'low');
  assert.strictEqual(signals[1].escalationLevel, 1);
  console.log('✅ Warning Emit (DEPRECATED_AGENT + Write Tool) passed');

  // 3. WARNING Filtering: DEPRECATED_AGENT + Read Tool -> NO Emit
  const warningReadEvent: GovernanceControlResult = {
    decision: 'WARNING',
    reasonCode: 'DEPRECATED_AGENT',
    toolName: 'chat.getHistory', // Read tool
    agentType: 'clinical',
    agentVersion: '1.0.0',
    policySnapshotHash: 'hash123',
    timestamp: new Date().toISOString(),
  };

  engine.processGovernanceEvent(warningReadEvent);
  assert.strictEqual(signals.length, 2, 'Should not have emitted for read tool warning');
  console.log('✅ Warning Noise Reduction (Read Tool) passed');

  // 4. WARNING Filtering: Other reasonCode -> NO Emit
  const otherWarningEvent: GovernanceControlResult = {
    decision: 'WARNING',
    reasonCode: 'RATE_LIMITED', // Warning version of rate limit (if it existed)
    toolName: 'chat.sendMessage',
    agentType: 'clinical',
    agentVersion: '1.0.0',
    policySnapshotHash: 'hash123',
    timestamp: new Date().toISOString(),
  };

  engine.processGovernanceEvent(otherWarningEvent);
  assert.strictEqual(signals.length, 2, 'Should not have emitted for other warning reasonCode');
  console.log('✅ Warning Noise Reduction (Other ReasonCode) passed');

  // 5. Critical Denial Still Works
  const criticalEvent: GovernanceControlResult = {
    decision: 'DENIED',
    reasonCode: 'UNKNOWN_AGENT',
    toolName: 'chat.sendMessage',
    agentType: 'unknown',
    agentVersion: 'unknown',
    policySnapshotHash: 'hash123',
    timestamp: new Date().toISOString(),
  };

  engine.processGovernanceEvent(criticalEvent);
  assert.strictEqual(signals.length, 3);
  assert.strictEqual(signals[2].escalationLevel, 3);
  console.log('✅ Critical Denial still works');

  console.log('All ApprovalSignal fix tests passed!');
}

try {
  testApprovalSignals();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
