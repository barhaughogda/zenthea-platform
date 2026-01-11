/**
 * E-05 §2 failure codes mapping to the bounded failure taxonomy.
 */
export enum ValidationFailureCode {
  /** CONTRACT: Structure missing or incomplete (E-03 §1) */
  CON_001 = 'CON-001',
  /** CONTRACT: Malformed or invalid types/values (E-03 §1) */
  CON_002 = 'CON-002',
  /** POLICY: Unknown or unauthorized classification (MIG-06) */
  POL_001 = 'POL-001',
  /** SECURITY: PHI/PII detected in metadata (E-01 §9.3) */
  SEC_001 = 'SEC_001',
  /** EXECUTION: Illegal state transition (E-01 §4.4) */
  EXE_001 = 'EXE-001',
}

/**
 * Structured validation failure.
 * Maps directly to E-05 abort requirements.
 */
export interface ValidationFailure {
  success: false;
  reason_code: ValidationFailureCode;
  message: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Successful validation result.
 */
export interface ValidationSuccess {
  success: true;
}

/**
 * Union type for validation outcomes.
 */
export type ValidationResult = ValidationSuccess | ValidationFailure;

/**
 * Helper to create a failure result.
 */
export function fail(
  code: ValidationFailureCode,
  message: string,
  metadata?: Record<string, string | number | boolean>
): ValidationFailure {
  return {
    success: false,
    reason_code: code,
    message,
    metadata,
  };
}

/**
 * Helper to create a success result.
 */
export function succeed(): ValidationSuccess {
  return { success: true };
}
