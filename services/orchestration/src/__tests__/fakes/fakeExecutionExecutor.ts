import { ExecutionExecutor } from '../../execution/executionExecutor';
import { ExecutionInput, ExecutionResult } from '../../execution/executionTypes';
import { OrchestrationAttemptId } from '../../orchestrator/types';

/**
 * PR-09: FakeExecutionExecutor (Deterministic, Fail-Closed)
 * 
 * Returns SUCCESS or FAILURE (EXE-002) based on the provided flag.
 */
export class FakeExecutionExecutor implements ExecutionExecutor {
  private nextStatus: 'SUCCESS' | 'FAILURE' = 'SUCCESS';

  public setNextStatus(status: 'SUCCESS' | 'FAILURE'): void {
    this.nextStatus = status;
  }

  public execute(attemptId: OrchestrationAttemptId, input: ExecutionInput): ExecutionResult {
    if (this.nextStatus === 'FAILURE') {
      return {
        status: 'FAILURE',
        error_code: 'EXE-002',
        metadata: {
          attempt_id: attemptId,
          command_id: input.command_id,
          reason: 'Simulated execution failure'
        }
      };
    }

    return {
      status: 'SUCCESS',
      evidence: {
        attempt_id: attemptId,
        command_id: input.command_id,
        outcome: 'DRAFT_GENERATED',
        model: 'fake-model-v1'
      }
    };
  }
}
