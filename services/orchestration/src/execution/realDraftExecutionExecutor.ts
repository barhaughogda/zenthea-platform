import { ExecutionExecutor } from './executionExecutor';
import { ExecutionInput, ExecutionResult } from './executionTypes';
import { OrchestrationAttemptId } from '../orchestrator/types';

/**
 * PR-11: RealDraftExecutionExecutor (Draft-Only).
 * 
 * The first real execution adapter, supporting only CLINICAL_DRAFT_GENERATION.
 * Preserves all Phase E and MIG-06 invariants.
 * 
 * Constraints:
 * - Synchronous only.
 * - Non-autonomous.
 * - Fail-closed (EXE-002).
 * - Metadata-only evidence.
 */
export class RealDraftExecutionExecutor implements ExecutionExecutor {
  /**
   * Executes a single command synchronously.
   * 
   * @param attemptId Correlated orchestration attempt
   * @param input Command parameters (metadata-only)
   */
  public execute(attemptId: OrchestrationAttemptId, input: ExecutionInput): ExecutionResult {
    // 1. Accept exactly ONE command type: CLINICAL_DRAFT_GENERATION
    if (input.type !== 'CLINICAL_DRAFT_GENERATION') {
      return {
        status: 'FAILURE',
        error_code: 'EXE-002',
        metadata: {
          reason: 'Unsupported command type for draft executor',
          received_type: input.type,
          attempt_id: attemptId,
          command_id: input.command_id
        }
      };
    }

    // 2. Synchronous-only simulation of draft generation
    // Returns metadata-only evidence (No PHI/PII)
    return {
      status: 'SUCCESS',
      evidence: {
        draft_type: 'CLINICAL_NOTE',
        generator: 'MIG-06-V1',
        attempt_id: attemptId,
        command_id: input.command_id
      }
    };
  }
}
