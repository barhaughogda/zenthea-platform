import { OrchestrationState } from '../state/types';
import { isValidTransition } from '../state/transitions';
import { ValidationResult, fail, succeed, ValidationFailureCode } from './validationErrors';

/**
 * Validates an orchestration state transition per E-01 §4.3.
 * Forbidden transitions result in an EXE-001 failure.
 */
export function validateTransition(from: OrchestrationState, to: OrchestrationState): ValidationResult {
  if (!isValidTransition(from, to)) {
    return fail(
      ValidationFailureCode.EXE_001,
      `Forbidden transition: ${from} -> ${to}`,
      { from, to }
    );
  }

  return succeed();
}
