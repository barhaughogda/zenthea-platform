import { describe, it, expect, vi } from 'vitest';
import { runOnce } from '../run/runOnce';
import { ControlPlanePolicyAdapter } from '../adapters/controlPlanePolicyAdapter';
import { ControlPlaneAuditAdapter } from '../adapters/controlPlaneAuditAdapter';
import { RealDraftExecutionExecutor } from '../execution/realDraftExecutionExecutor';
import { OrchestrationTrigger } from '../contracts/trigger';
import { ControlPlaneContext, IPolicyEvaluator, IAuditEmitter } from '@starter/control-plane';
import { OrchestrationState } from '../state/types';
import { OrchestrationAbort } from '../contracts/abort';

describe('Runner Real Wiring (PR-10)', () => {
  const validTrigger: OrchestrationTrigger = {
    version: '1.0.0',
    trigger_id: 'test-trigger-id',
    classification: 'MIG06_V1_CLINICAL_DRAFT_ASSIST',
    metadata: {},
    timestamp: '2026-01-11T12:00:00Z' // Static for determinism
  };

  const validCtx: ControlPlaneContext = {
    traceId: 'test-trace-id',
    actorId: 'test-actor-id',
    policyVersion: '1.0.0'
  };

  it('DENY from Control Plane => REJECTED with POL-001', () => {
    // 1. Setup real adapters with mocked CP dependencies
    const mockCPPolicyEvaluator = {
      evaluate: vi.fn().mockReturnValue({
        effect: 'DENY',
        reasonCode: 'POL-001-TEST',
        timestamp: new Date().toISOString()
      })
    } as unknown as IPolicyEvaluator;

    const mockCPAuditEmitter = {
      emit: vi.fn().mockReturnValue(undefined) // Success (sync)
    } as unknown as IAuditEmitter;

    const policyAdapter = new ControlPlanePolicyAdapter(mockCPPolicyEvaluator, 'MIG06_V1');
    const auditAdapter = new ControlPlaneAuditAdapter(mockCPAuditEmitter);
    const executionExecutor = new RealDraftExecutionExecutor();

    // 2. Run via runOnce entrypoint
    const result = runOnce({
      trigger: validTrigger,
      ctx: validCtx,
      deps: {
        policy: policyAdapter,
        audit: auditAdapter,
        execution: executionExecutor
      }
    }) as OrchestrationAbort;

    // 3. Assertions
    expect(result.reason_code).toBe('POL-001');
    expect(result.stop_authority).toBe('CONTROL_PLANE');
    // The mock evaluator was called
    expect(mockCPPolicyEvaluator.evaluate).toHaveBeenCalled();
  });

  it('Audit Sink THROW => BLOCKED with AUD-001', () => {
    const mockCPPolicyEvaluator = {
      evaluate: vi.fn().mockReturnValue({
        effect: 'PERMIT',
        timestamp: new Date().toISOString()
      })
    } as unknown as IPolicyEvaluator;

    const mockCPAuditEmitter = {
      emit: vi.fn().mockImplementation(() => {
        throw new Error('Sink Unreachable');
      })
    } as unknown as IAuditEmitter;

    const policyAdapter = new ControlPlanePolicyAdapter(mockCPPolicyEvaluator, 'MIG06_V1');
    const auditAdapter = new ControlPlaneAuditAdapter(mockCPAuditEmitter);
    const executionExecutor = new RealDraftExecutionExecutor();

    const result = runOnce({
      trigger: validTrigger,
      ctx: validCtx,
      deps: {
        policy: policyAdapter,
        audit: auditAdapter,
        execution: executionExecutor
      }
    }) as OrchestrationAbort;

    expect(result.reason_code).toBe('AUD-001');
    expect(result.stop_authority).toBe('ORCHESTRATOR');
  });

  it('Audit Sink ASYNC (Promise) => BLOCKED with AUD-001 (Fail-Closed)', () => {
    const mockCPPolicyEvaluator = {
      evaluate: vi.fn().mockReturnValue({
        effect: 'PERMIT',
        timestamp: new Date().toISOString()
      })
    } as unknown as IPolicyEvaluator;

    const mockCPAuditEmitter = {
      emit: vi.fn().mockReturnValue(Promise.resolve()) // ASYNC
    } as unknown as IAuditEmitter;

    const policyAdapter = new ControlPlanePolicyAdapter(mockCPPolicyEvaluator, 'MIG06_V1');
    const auditAdapter = new ControlPlaneAuditAdapter(mockCPAuditEmitter);
    const executionExecutor = new RealDraftExecutionExecutor();

    const result = runOnce({
      trigger: validTrigger,
      ctx: validCtx,
      deps: {
        policy: policyAdapter,
        audit: auditAdapter,
        execution: executionExecutor
      }
    }) as OrchestrationAbort;

    // PR-10 requirement: Orchestration remains synchronous.
    // If adapter sees a promise, it must fail-closed.
    expect(result.reason_code).toBe('AUD-001');
  });

  it('Invalid Context (CP-21) => Throws (Fail-Closed)', () => {
    const mockCPPolicyEvaluator = {} as IPolicyEvaluator;
    const mockCPAuditEmitter = {} as IAuditEmitter;
    const policyAdapter = new ControlPlanePolicyAdapter(mockCPPolicyEvaluator, 'MIG06_V1');
    const auditAdapter = new ControlPlaneAuditAdapter(mockCPAuditEmitter);
    const executionExecutor = new RealDraftExecutionExecutor();

    expect(() => {
      runOnce({
        trigger: validTrigger,
        ctx: { traceId: '', actorId: '', policyVersion: '' } as any,
        deps: {
          policy: policyAdapter,
          audit: auditAdapter,
          execution: executionExecutor
        }
      });
    }).toThrow('GOVERNANCE_FAILURE');
  });
});
