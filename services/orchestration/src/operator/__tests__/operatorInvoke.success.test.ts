import { describe, it, expect, vi } from 'vitest';
import { invokeFromOperator } from '../operatorInvoke';
import { OperatorInvocationInput } from '../operatorTypes';
import { ControlPlaneContext } from '@starter/control-plane';
import * as invocation from '../../invocation/invokeOrchestration';

// Mock invokeOnce to verify delegation
vi.mock('../../invocation/invokeOrchestration', () => ({
  invokeOnce: vi.fn().mockReturnValue({
    version: '1.0.0',
    attempt_id: 'mock-attempt-id',
    outcome: 'SUCCEEDED',
    evidence: { mock: 'evidence' },
    audit_correlation_id: 'mock-audit-id'
  })
}));

describe('Operator Invocation: Success Path', () => {
  const validCtx: ControlPlaneContext = {
    traceId: 'test-trace-id',
    actorId: 'test-actor-id',
    policyVersion: '1.0.0'
  };

  const validInput: OperatorInvocationInput = {
    action: 'CLINICAL_DRAFT_ASSIST',
    subject_id: 'patient-123',
    metadata: {
      location: 'emergency-room'
    }
  };

  it('valid input => successfully delegates and returns result verbatim', () => {
    const result = invokeFromOperator(validCtx, validInput);

    if ('outcome' in result) {
      expect(result.outcome).toBe('SUCCEEDED');
    } else {
      throw new Error('Expected OrchestrationResult but got OrchestrationAbort');
    }
    expect(result.attempt_id).toBe('mock-attempt-id');
  });

  it('valid input => translates trigger correctly with hard-coded classification', () => {
    invokeFromOperator(validCtx, validInput);

    expect(invocation.invokeOnce).toHaveBeenCalledWith(
      validCtx,
      expect.objectContaining({
        version: '1.0.0',
        classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST',
        metadata: expect.objectContaining({
          subject_id: 'patient-123',
          operator_action: 'CLINICAL_DRAFT_ASSIST',
          location: 'emergency-room'
        })
      })
    );
  });
});
