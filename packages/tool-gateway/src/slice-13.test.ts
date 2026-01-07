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

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  async query(): Promise<GovernanceTimelineEvent[]> {
    return [];
  }
  async getEvent(): Promise<GovernanceTimelineEvent | null> {
    return null;
  }
}

/**
 * Mock Audit Emitter for Slice 13 testing.
 */
class MockOperatorAuditEmitter implements IOperatorAuditEmitter {
  public emittedEvents: OperatorAuditEvent[] = [];

  async emit(event: OperatorAuditEvent): Promise<void> {
    this.emittedEvents.push(event);
  }
}

async function testSlice13() {
  console.log('Running Slice 13 (Operator Audit) tests...');

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

  // 1. Unknown policyId emits REJECTED with UNKNOWN_POLICY_ID
  mockAuditEmitter.emittedEvents = [];
  try {
    await api.executePolicy('non-existent-policy');
    assert.fail('Should have thrown');
  } catch (err: unknown) {
    if (err instanceof Error) {
      assert.ok(err.message.includes('Unknown policyId'));
    } else {
      assert.fail('Thrown error is not an Error instance');
    }
  }
  assert.strictEqual(mockAuditEmitter.emittedEvents.length, 1);
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].outcome, 'REJECTED');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].reasonCode, 'UNKNOWN_POLICY_ID');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].policyId, 'non-existent-policy');
  console.log('✅ Unknown policyId audit passed');

  // 2. Unknown viewId emits REJECTED with UNKNOWN_VIEW_ID
  mockAuditEmitter.emittedEvents = [];
  try {
    await api.executeView('non-existent-view');
    assert.fail('Should have thrown');
  } catch (err: unknown) {
    if (err instanceof Error) {
      assert.ok(err.message.includes('Unknown viewId'));
    } else {
      assert.fail('Thrown error is not an Error instance');
    }
  }
  assert.strictEqual(mockAuditEmitter.emittedEvents.length, 1);
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].outcome, 'REJECTED');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].reasonCode, 'UNKNOWN_VIEW_ID');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].viewId, 'non-existent-view');
  console.log('✅ Unknown viewId audit passed');

  // 3. Successful executePolicy emits ALLOWED
  mockAuditEmitter.emittedEvents = [];
  const policyResult = await api.executePolicy('active-clinical-agents');
  assert.ok(policyResult);
  assert.strictEqual(mockAuditEmitter.emittedEvents.length, 1);
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].outcome, 'ALLOWED');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].action, 'POLICY_EXECUTE');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].policyId, 'active-clinical-agents');
  assert.strictEqual(mockAuditEmitter.emittedEvents[0].target, 'agentRegistry');
  console.log('✅ Successful executePolicy audit passed');

  // 4. Successful executeView emits ALLOWED (both for policy and view)
  mockAuditEmitter.emittedEvents = [];
  const viewResult = await api.executeView('denied-tools-view');
  assert.ok(viewResult);
  // Should have 2 events: one for POLICY_EXECUTE (from executePolicy) and one for VIEW_EXECUTE
  assert.strictEqual(mockAuditEmitter.emittedEvents.length, 2);
  
  const policyEvent = mockAuditEmitter.emittedEvents.find(e => e.action === 'POLICY_EXECUTE');
  const viewEvent = mockAuditEmitter.emittedEvents.find(e => e.action === 'VIEW_EXECUTE');
  
  assert.ok(policyEvent);
  assert.strictEqual(policyEvent!.outcome, 'ALLOWED');
  assert.strictEqual(policyEvent!.policyId, 'recent-denied-tools');
  
  assert.ok(viewEvent);
  assert.strictEqual(viewEvent!.outcome, 'ALLOWED');
  assert.strictEqual(viewEvent!.viewId, 'denied-tools-view');
  assert.strictEqual(viewEvent!.policyId, 'recent-denied-tools');
  console.log('✅ Successful executeView audit passed');

  // 5. Security - Forbidden fields
  const forbiddenFields = ['tenantId', 'actorId', 'requestId', 'idempotencyKey', 'payload', 'cursor'];
  mockAuditEmitter.emittedEvents.forEach(event => {
    forbiddenFields.forEach(field => {
      assert.strictEqual((event as unknown as Record<string, unknown>)[field], undefined, `Audit event MUST NOT contain ${field}`);
    });
  });
  console.log('✅ Security (forbidden fields) in audit passed');

  console.log('All Slice 13 tests passed! 🛡️');
}

testSlice13().catch(err => {
  console.error('❌ Slice 13 Tests failed:');
  console.error(err);
  process.exit(1);
});
