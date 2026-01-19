/**
 * EHR Core Authority Types - Phase F.2 Slice 1
 *
 * Authority context represents verified human clinician intent for write operations.
 * This is NOT a boolean flag - it is a structured signal that:
 * - Identifies the clinician performing the action
 * - Indicates explicit intent (not inferred from client context)
 * - Is NOT trusted from unverified client sources
 *
 * INVARIANTS (from Phase F-00):
 * - Human authority over clinical truth MUST be preserved
 * - Writes MUST be attributable to a human clinician
 * - Attribution MUST NOT be inferred from client context
 */

/**
 * AuthorityContext represents verified human clinician authority for write operations.
 *
 * This object MUST be constructed by trusted server-side code that has verified
 * the clinician's identity and intent. It MUST NOT be accepted from client payloads.
 *
 * The presence of this object signals that a verified human clinician has expressed
 * explicit intent to perform the operation.
 */
export interface AuthorityContext {
  /**
   * Unique identifier of the clinician performing the action.
   * This MUST be server-verified, not client-provided.
   */
  readonly clinicianId: string;

  /**
   * Tenant scope for multi-tenant isolation.
   */
  readonly tenantId: string;

  /**
   * ISO-8601 timestamp when authority was established.
   * Used for audit and temporal ordering.
   */
  readonly authorizedAt: string;

  /**
   * Opaque correlation identifier for audit trail linkage.
   * Allows tracing authority back to the original verification event.
   */
  readonly correlationId: string;

  /**
   * Marker to prevent accidental construction.
   * Only the authority verification layer should construct these objects.
   */
  readonly _authorityMarker: symbol;
}

/**
 * Symbol used to mark valid AuthorityContext objects.
 * This prevents accidental construction of authority context from client data.
 */
export const AUTHORITY_MARKER = Symbol.for("zenthea.ehr.authority.verified");

/**
 * Creates a verified AuthorityContext. This function MUST only be called
 * by trusted server-side code that has verified clinician identity and intent.
 *
 * @internal - Not exposed to external callers
 */
export function createAuthorityContext(params: {
  clinicianId: string;
  tenantId: string;
  correlationId: string;
}): AuthorityContext {
  return Object.freeze({
    clinicianId: params.clinicianId,
    tenantId: params.tenantId,
    authorizedAt: new Date().toISOString(),
    correlationId: params.correlationId,
    _authorityMarker: AUTHORITY_MARKER,
  });
}

/**
 * Validates that an AuthorityContext is structurally valid.
 * Returns false if the context is missing, malformed, or not properly constructed.
 */
export function isValidAuthorityContext(
  context: unknown
): context is AuthorityContext {
  if (context === null || context === undefined) {
    return false;
  }
  if (typeof context !== "object") {
    return false;
  }

  const ctx = context as Record<string, unknown>;

  // Check required fields
  if (typeof ctx.clinicianId !== "string" || ctx.clinicianId.length === 0) {
    return false;
  }
  if (typeof ctx.tenantId !== "string" || ctx.tenantId.length === 0) {
    return false;
  }
  if (typeof ctx.authorizedAt !== "string" || ctx.authorizedAt.length === 0) {
    return false;
  }
  if (typeof ctx.correlationId !== "string" || ctx.correlationId.length === 0) {
    return false;
  }

  // Check authority marker - prevents client-constructed objects
  if (ctx._authorityMarker !== AUTHORITY_MARKER) {
    return false;
  }

  return true;
}
