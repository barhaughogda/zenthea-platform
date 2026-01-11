import { OrchestrationCommand } from '../contracts/command';

/**
 * Deterministic outcome of a single execution step.
 * E-01 §3.2 (Phase 4) compliant.
 */
export type ExecutionResult = 
  | { status: 'SUCCESS'; evidence: Record<string, any> }
  | { status: 'FAILURE'; error_code: 'EXE-002'; metadata: Record<string, any> };

/**
 * Metadata-only input for the execution boundary.
 * Alias for OrchestrationCommand to satisfy PR-07 scope requirements.
 */
export type ExecutionInput = OrchestrationCommand;
