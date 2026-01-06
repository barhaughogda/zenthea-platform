import assert from 'node:assert';
import { test } from 'node:test';
import { 
  createTransitionTelemetry, 
  TransitionEvent 
} from './lifecycle-telemetry';
import { 
  emitTransitionRequestTelemetry, 
  emitTransitionDecisionTelemetry,
  TransitionRequest,
  TransitionDecision
} from './lifecycle';

test('Lifecycle Transition Telemetry', async (t) => {
  const events: TransitionEvent[] = [];
  const mockLogger = {
    info: (_tag: string, _msg: string, data: any) => {
      events.push(data);
    },
    error: (_tag: string, _msg: string, _data: any) => {}
  };

  const telemetry = createTransitionTelemetry(mockLogger);
  const policyHash = 'test-policy-hash-123';

  await t.test('should emit telemetry for transition request', () => {
    const request: TransitionRequest = {
      agentId: 'agent-1',
      agentVersion: '1.0.0',
      fromState: 'experimental',
      toState: 'active',
      reason: 'Testing',
      requestedByRole: 'admin',
      timestamp: new Date().toISOString(),
    };

    emitTransitionRequestTelemetry(telemetry, request, policyHash);

    assert.strictEqual(events.length, 1);
    assert.strictEqual(events[0].decision, 'requested');
    assert.strictEqual(events[0].agentVersion, '1.0.0');
    assert.strictEqual(events[0].fromState, 'experimental');
    assert.strictEqual(events[0].toState, 'active');
    assert.strictEqual(events[0].policySnapshotHash, policyHash);
    assert.ok(events[0].timestamp);
  });

  await t.test('should emit telemetry for approved transition decision', () => {
    const request: TransitionRequest = {
      agentId: 'agent-1',
      agentVersion: '1.0.0',
      fromState: 'active',
      toState: 'deprecated',
      reason: 'Retiring',
      requestedByRole: 'admin',
      timestamp: new Date().toISOString(),
    };

    const decision: TransitionDecision = {
      requestId: 'req-2',
      decision: 'approve',
      decidedByRole: 'governance-lead',
      timestamp: new Date().toISOString(),
    };

    emitTransitionDecisionTelemetry(telemetry, request, decision, policyHash);

    assert.strictEqual(events.length, 2);
    assert.strictEqual(events[1].decision, 'approved');
    assert.strictEqual(events[1].agentVersion, '1.0.0');
    assert.strictEqual(events[1].fromState, 'active');
    assert.strictEqual(events[1].toState, 'deprecated');
    assert.strictEqual(events[1].policySnapshotHash, policyHash);
  });

  await t.test('should emit telemetry for rejected transition decision', () => {
    const request: TransitionRequest = {
      agentId: 'agent-1',
      agentVersion: '1.0.0',
      fromState: 'deprecated',
      toState: 'active', // Forbidden
      reason: 'Undo',
      requestedByRole: 'admin',
      timestamp: new Date().toISOString(),
    };

    const decision: TransitionDecision = {
      requestId: 'req-3',
      decision: 'reject',
      decidedByRole: 'system',
      timestamp: new Date().toISOString(),
    };

    emitTransitionDecisionTelemetry(telemetry, request, decision, policyHash);

    assert.strictEqual(events.length, 3);
    assert.strictEqual(events[2].decision, 'rejected');
  });
});
