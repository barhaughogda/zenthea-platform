import { describe, it, expect, vi } from 'vitest';
import { invokeOnce } from '../invocation/invokeOrchestration';
import { OrchestrationTrigger } from '../contracts/trigger';
import { ControlPlaneContext } from '@starter/control-plane';

// Mock runOnce to verify delegation without triggering full orchestration logic
vi.mock('../run/runOnce', () => ({
  runOnce: vi.fn().mockReturnValue({
    version: '1.0.0',
    attempt_id: 'mock-attempt-id',
    outcome: 'SUCCEEDED',
    evidence: { mock: 'evidence' },
    audit_correlation_id: 'mock-audit-id'
  })
}));

describe('Invocation Boundary (PR-12)', () => {
  const validTrigger: OrchestrationTrigger = {
    version: '1.0.0',
    trigger_id: 'test-trigger-id',
    classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST',
    metadata: {},
    timestamp: new Date().toISOString()
  };

  const validCtx: ControlPlaneContext = {
    traceId: 'test-trace-id',
    actorId: 'test-actor-id',
    policyVersion: '1.0.0'
  };

  it('Valid context and trigger => Successfully delegates to runOnce', () => {
    const result = invokeOnce(validCtx, validTrigger);

    // Verify result transparency
    if ('outcome' in result) {
      expect(result.outcome).toBe('SUCCEEDED');
    } else {
      throw new Error('Expected OrchestrationResult but got OrchestrationAbort');
    }
    expect(result.attempt_id).toBe('mock-attempt-id');
  });

  it('Missing traceId in context => Fails immediately (Fail-Closed)', () => {
    const invalidCtx = { actorId: 'test-actor-id', policyVersion: '1.0.0' } as any;

    expect(() => {
      invokeOnce(invalidCtx, validTrigger);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });

  it('Missing actorId in context => Fails immediately (Fail-Closed)', () => {
    const invalidCtx = { traceId: 'test-trace-id', policyVersion: '1.0.0' } as any;

    expect(() => {
      invokeOnce(invalidCtx, validTrigger);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });

  it('Null context => Fails immediately (Fail-Closed)', () => {
    expect(() => {
      invokeOnce(null as any, validTrigger);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });

  it('Preserves synchronous execution (No Promises)', () => {
    const result = invokeOnce(validCtx, validTrigger);
    
    // In Vitest, if it were a promise, this check would still pass but 
    // the TypeScript types and the mock ensure we aren't dealing with async here.
    expect(result).not.toBeInstanceOf(Promise);
    if ('outcome' in result) {
      expect(result.outcome).toBe('SUCCEEDED');
    }
  });
});
