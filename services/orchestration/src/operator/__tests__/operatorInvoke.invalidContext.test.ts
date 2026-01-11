import { describe, it, expect } from 'vitest';
import { invokeFromOperator } from '../operatorInvoke';
import { OperatorInvocationInput } from '../operatorTypes';

describe('Operator Invocation: Invalid Context', () => {
  const validInput: OperatorInvocationInput = {
    action: 'CLINICAL_DRAFT_ASSIST',
    subject_id: 'patient-123',
    metadata: {}
  };

  it('null context => throws GOVERNANCE_FAILURE', () => {
    expect(() => {
      invokeFromOperator(null as any, validInput);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });

  it('missing traceId => throws GOVERNANCE_FAILURE', () => {
    const invalidCtx = { actorId: 'test-actor' } as any;
    expect(() => {
      invokeFromOperator(invalidCtx, validInput);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });

  it('missing actorId => throws GOVERNANCE_FAILURE', () => {
    const invalidCtx = { traceId: 'test-trace' } as any;
    expect(() => {
      invokeFromOperator(invalidCtx, validInput);
    }).toThrow('GOVERNANCE_FAILURE: Missing or invalid ControlPlaneContext');
  });
});
