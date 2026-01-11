import { OrchestrationTrigger } from '../contracts/trigger';
import { OrchestrationResult } from '../contracts/result';
import { OrchestrationAbort } from '../contracts/abort';
import { OrchestrationState } from '../state/types';

/**
 * Unique identifier for an orchestration attempt (UUID).
 */
export type OrchestrationAttemptId = string;

/**
 * Result of a single orchestration step.
 */
export type StepResult<T = void> = 
  | { success: true; data: T }
  | { success: false; abort: OrchestrationAbort };

/**
 * Injected logic for orchestration steps.
 * The orchestrator remains inert until these are provided.
 */
export interface OrchestratorExecutors {
  /** Step 1: Validate trigger structure and classification */
  validateTrigger: (trigger: OrchestrationTrigger) => StepResult<void>;
  
  /** Step 2: Verify all dependencies are READY */
  checkReadiness: (attemptId: OrchestrationAttemptId) => StepResult<void>;
  
  /** Step 3: Evaluate policy and authorize execution */
  evaluatePolicy: (attemptId: OrchestrationAttemptId, trigger: OrchestrationTrigger) => StepResult<string>; // returns policy_decision_id
  
  /** Step 4: Dispatch the command to the agent */
  executeCommand: (attemptId: OrchestrationAttemptId, trigger: OrchestrationTrigger) => StepResult<Record<string, any>>; // returns evidence
  
  /** Step 5: Emit audit markers and await ACK */
  emitAudit: (attemptId: OrchestrationAttemptId, trigger: OrchestrationTrigger, decisionId: string, evidence: Record<string, any>) => StepResult<string>; // returns audit_correlation_id
  
  /** Step 6: Completion signal */
  onComplete: (result: OrchestrationResult | OrchestrationAbort) => void;
}

/**
 * Orchestration lifecycle events for external monitoring.
 */
export interface OrchestrationLifecycleHooks {
  onStateTransition?: (attemptId: OrchestrationAttemptId, from: OrchestrationState, to: OrchestrationState) => void;
}
