import { describe, it, expect, vi } from 'vitest';
import { runOnce } from '../run/runOnce';
import { RealDraftExecutionExecutor } from '../execution/realDraftExecutionExecutor';
import { ControlPlanePolicyAdapter } from '../adapters/controlPlanePolicyAdapter';
import { ControlPlaneAuditAdapter } from '../adapters/controlPlaneAuditAdapter';
import { OrchestrationTrigger } from '../contracts/trigger';
import { ControlPlaneContext, IPolicyEvaluator, IAuditEmitter } from '@starter/control-plane';
import { OrchestrationAbort } from '../contracts/abort';
import { OrchestrationResult } from '../contracts/result';

describe('Real Draft Execution (PR-11)', () => {
  const validTrigger: OrchestrationTrigger = {
    version: '1.0.0',
    trigger_id: 'test-trigger-id',
    classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST',
    metadata: {},
    timestamp: '2026-01-11T12:00:00Z'
  };

  const validCtx: ControlPlaneContext = {
    traceId: 'test-trace-id',
    actorId: 'test-actor-id',
    policyVersion: '1.0.0'
  };

  const mockCPPolicyEvaluator = {
    evaluate: vi.fn().mockReturnValue({
      effect: 'PERMIT',
      decision_id: 'test-decision-id',
      timestamp: new Date().toISOString()
    })
  } as unknown as IPolicyEvaluator;

  const mockCPAuditEmitter = {
    emit: vi.fn().mockReturnValue({ status: 'ACK' })
  } as unknown as IAuditEmitter;

  const policyAdapter = new ControlPlanePolicyAdapter(mockCPPolicyEvaluator, 'MIG06_V1');
  const auditAdapter = new ControlPlaneAuditAdapter(mockCPAuditEmitter);

  it('Draft executor SUCCESS => SUCCEEDED', () => {
    // 1. Setup real draft executor
    const executionExecutor = new RealDraftExecutionExecutor();

    // 2. Execute via runOnce
    const result = runOnce({
      trigger: validTrigger,
      ctx: validCtx,
      deps: {
        policy: policyAdapter,
        audit: auditAdapter,
        execution: executionExecutor
      }
    }) as OrchestrationResult;

    // 3. Assertions
    expect(result.outcome).toBe('SUCCEEDED');
    expect(result.evidence).toMatchObject({
      draft_type: 'CLINICAL_NOTE',
      generator: 'MIG-06-V1'
    });
    // Stop authority for successful orchestration is implicitly the orchestrator completing the flow
    // but the OrchestrationResult interface doesn't have stop_authority.
    // The requirement mentions assertions must include Stop authority = ORCHESTRATOR,
    // which applies to the Abort case or the internal state.
  });

  it('Unsupported command => ERROR (EXE-002)', () => {
    // 1. Setup real draft executor
    const executionExecutor = new RealDraftExecutionExecutor();

    // 2. To test the executor's internal failure logic for unsupported commands,
    // we test the execute method directly since the Orchestrator (PR-10) 
    // currently hardcodes the command type to 'CLINICAL_DRAFT_GENERATION'.
    const invalidCommand: any = {
      version: '1.0.0',
      command_id: 'test-command-id',
      attempt_id: 'test-attempt-id',
      type: 'UNSUPPORTED_COMMAND_TYPE',
      parameters: {},
      idempotency_key: 'test-key'
    };

    const execResult = executionExecutor.execute('test-attempt-id', invalidCommand);

    // 3. Assertions on executor result
    expect(execResult.status).toBe('FAILURE');
    if (execResult.status === 'FAILURE') {
      expect(execResult.error_code).toBe('EXE-002');
      expect(execResult.metadata.reason).toContain('Unsupported command type');
    }

    // 4. Verify that the orchestrator would handle this failure correctly
    // by using a spy that returns this failure.
    const spy = vi.spyOn(executionExecutor, 'execute').mockReturnValue({
      status: 'FAILURE',
      error_code: 'EXE-002',
      metadata: { 
        reason: 'Simulated unsupported command',
        attempt_id: 'test-attempt-id',
        command_id: 'test-command-id'
      }
    });

    const result = runOnce({
      trigger: validTrigger,
      ctx: validCtx,
      deps: {
        policy: policyAdapter,
        audit: auditAdapter,
        execution: executionExecutor
      }
    }) as OrchestrationAbort;

    expect(result.reason_code).toBe('EXE-002');
    expect(result.stop_authority).toBe('ORCHESTRATOR');
    expect(result.metadata.reason).toBe('Simulated unsupported command');
    
    spy.mockRestore();
  });
});
