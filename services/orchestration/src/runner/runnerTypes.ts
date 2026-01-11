import { OrchestrationTrigger } from '../contracts/trigger';
import { OrchestrationResult } from '../contracts/result';
import { OrchestrationAbort } from '../contracts/abort';

/**
 * PR-08: Runner Input (Metadata-only).
 * 
 * Defines the strict, non-autonomous boundary for entering orchestration.
 */
export interface RunnerInput {
  trigger: OrchestrationTrigger;
}

/**
 * PR-08: Runner Output (Metadata-only).
 * 
 * The terminal state of an orchestration attempt.
 */
export type RunnerOutput = OrchestrationResult | OrchestrationAbort;
