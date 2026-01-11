import { OrchestrationContext } from '../contracts/context';
import { ValidationResult, fail, succeed, ValidationFailureCode } from './validationErrors';

/**
 * UUID v4 regex pattern.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * PHI/PII detection patterns per E-01 §9.3.
 * These are strictly enforced markers that MUST NOT be present in metadata.
 */
const PHI_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
  /\b\d{10,12}\b/, // Phone-like (strict numeric sequence)
];

/**
 * Detects PHI/PII in metadata values.
 * Fail-closed doctrine per E-01 §9.3.
 * All validation is deterministic and synchronous.
 */
export function detectPHI(metadata: Record<string, string | number | boolean>): boolean {
  for (const value of Object.values(metadata)) {
    if (typeof value === 'string') {
      for (const pattern of PHI_PATTERNS) {
        if (pattern.test(value)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * E-03 §1.3 OrchestrationContext Validation.
 * Validates context completeness, versioning, and governance markers.
 * Runtime behavior is impossible without passing this validation.
 */
export function validateContext(context: unknown): ValidationResult {
  if (typeof context !== 'object' || context === null) {
    return fail(ValidationFailureCode.CON_001, 'Context must be a non-null object');
  }

  const c = context as Partial<OrchestrationContext>;

  // 1. Missing fields (CON-001)
  const requiredFields: (keyof OrchestrationContext)[] = [
    'attempt_id',
    'policy_id',
    'policy_version',
    'trace_id',
    'audit_id',
    'governance_mode'
  ];

  for (const field of requiredFields) {
    if (c[field] === undefined) {
      return fail(ValidationFailureCode.CON_001, `Missing required field: ${field}`, { field });
    }
  }

  // 2. ID formats (CON-002)
  const uuidFields: (keyof OrchestrationContext)[] = ['attempt_id', 'audit_id'];
  for (const field of uuidFields) {
    const val = c[field];
    if (typeof val !== 'string' || !UUID_REGEX.test(val)) {
      return fail(ValidationFailureCode.CON_002, `Invalid ${field} format. Expected UUID v4`, {
        actual: val || 'undefined'
      });
    }
  }

  // 3. Governance Mode check (POL-001)
  if (c.governance_mode !== 'PHASE_E_RESTRICTED') {
    return fail(ValidationFailureCode.POL_001, `Invalid governance mode: ${c.governance_mode}`, {
      actual: c.governance_mode || 'undefined',
      expected: 'PHASE_E_RESTRICTED'
    });
  }

  return succeed();
}
