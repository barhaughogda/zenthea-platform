import { describe, it, expect } from 'vitest';
import { invokeFromOperator } from '../operatorInvoke';
import { ControlPlaneContext } from '@starter/control-plane';

describe('Operator Invocation: Invalid Action/Input', () => {
  const validCtx: ControlPlaneContext = {
    traceId: 'test-trace-id',
    actorId: 'test-actor-id',
    policyVersion: '1.0.0'
  };

  it('incorrect action => throws GOVERNANCE_FAILURE', () => {
    const invalidInput = {
      action: 'INVALID_ACTION',
      subject_id: 'patient-123',
      metadata: {}
    } as any;

    expect(() => {
      invokeFromOperator(validCtx, invalidInput);
    }).toThrow("GOVERNANCE_FAILURE: Invalid action 'INVALID_ACTION'");
  });

  it('missing subject_id => throws GOVERNANCE_FAILURE', () => {
    const invalidInput = {
      action: 'CLINICAL_DRAFT_ASSIST',
      metadata: {}
    } as any;

    expect(() => {
      invokeFromOperator(validCtx, invalidInput);
    }).toThrow('GOVERNANCE_FAILURE: Missing subject_id');
  });

  it('missing input => throws GOVERNANCE_FAILURE', () => {
    expect(() => {
      invokeFromOperator(validCtx, null as any);
    }).toThrow('GOVERNANCE_FAILURE: Missing OperatorInvocationInput');
  });
});
