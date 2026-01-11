import { OrchestrationTrigger } from '../contracts/trigger';
import { ValidationResult, fail, succeed, ValidationFailureCode } from './validationErrors';
import { detectPHI } from './validateContext';

/**
 * UUID v4 regex pattern.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * ISO8601 regex pattern (strict).
 */
const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

/**
 * E-03 §1.1 OrchestrationTrigger Validation.
 * Validates trigger structure and MIG-06 specific constraints.
 * No async IO or side effects allowed.
 */
export function validateTrigger(trigger: unknown): ValidationResult {
  if (typeof trigger !== 'object' || trigger === null) {
    return fail(ValidationFailureCode.CON_001, 'Trigger must be a non-null object');
  }

  const t = trigger as Partial<OrchestrationTrigger>;

  // 1. Missing fields (CON-001)
  const requiredFields: (keyof OrchestrationTrigger)[] = [
    'version',
    'trigger_id',
    'classification',
    'metadata',
    'timestamp'
  ];

  for (const field of requiredFields) {
    if (t[field] === undefined) {
      return fail(ValidationFailureCode.CON_001, `Missing required field: ${field}`, { field });
    }
  }

  // 2. Version check (CON-002)
  if (t.version !== '1.0.0') {
    return fail(ValidationFailureCode.CON_002, `Invalid version: ${t.version}. Expected 1.0.0`, {
      actual: t.version || 'undefined',
      expected: '1.0.0'
    });
  }

  // 3. Trigger ID format (CON-002)
  if (typeof t.trigger_id !== 'string' || !UUID_REGEX.test(t.trigger_id)) {
    return fail(ValidationFailureCode.CON_002, 'Invalid trigger_id format. Expected UUID v4', {
      actual: t.trigger_id || 'undefined'
    });
  }

  // 4. Classification check (POL-001)
  if (t.classification !== 'MIG06_V1_CLINICAL_DRAFT_ASSIST') {
    return fail(ValidationFailureCode.POL_001, `Unauthorized classification: ${t.classification}`, {
      actual: t.classification || 'undefined',
      allowed: 'MIG06_V1_CLINICAL_DRAFT_ASSIST'
    });
  }

  // 5. Timestamp format (CON-002)
  if (typeof t.timestamp !== 'string' || !ISO8601_REGEX.test(t.timestamp)) {
    return fail(ValidationFailureCode.CON_002, 'Invalid timestamp format. Expected ISO8601', {
      actual: t.timestamp || 'undefined'
    });
  }

  // 6. Metadata structure (CON-002)
  if (typeof t.metadata !== 'object' || t.metadata === null) {
    return fail(ValidationFailureCode.CON_002, 'Metadata must be a non-null object');
  }

  // 7. PHI Detection (SEC-001) per E-01 §9.3
  if (detectPHI(t.metadata as Record<string, string | number | boolean>)) {
    return fail(ValidationFailureCode.SEC_001, 'PHI/PII detected in trigger metadata');
  }

  return succeed();
}
