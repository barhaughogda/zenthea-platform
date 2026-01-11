import { OrchestrationAttemptId } from '../orchestrator/types';
import { ExecutionInput, ExecutionResult } from './executionTypes';

/**
 * PR-07: Execution Boundary (Single-Step, Non-Autonomous).
 * 
 * An injected interface that handles the synchronous execution of exactly one
 * command. This boundary prevents the orchestrator from containing agent logic
 * or selecting which logic to run.
 * 
 * Behavior rules:
 * - Execution MUST be synchronous.
 * - Execution MUST be non-autonomous (orchestrator defines what to run).
 * - Execution failure MUST return EXE-002.
 */
export interface ExecutionExecutor {
  /**
   * Executes a single command synchronously.
   * 
   * Constraints:
   * - No retries.
   * - No branching.
   * - Synchronous return only.
   */
  execute(attemptId: OrchestrationAttemptId, input: ExecutionInput): ExecutionResult;
}
