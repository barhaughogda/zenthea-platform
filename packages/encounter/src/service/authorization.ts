/**
 * Encounter Service Authorization - Slice 01
 *
 * Layer 2: Authorization Boundary
 * Enforces authority validity and cross-tenant constraints.
 */

import {
  TransportAuthorityContext,
  EncounterServiceError,
} from "../transport/types.js";

export class AuthorizationError implements EncounterServiceError {
  readonly type = "AUTHORIZATION_ERROR";
  constructor(readonly message: string) {}
}

export class ForbiddenError implements EncounterServiceError {
  readonly type = "FORBIDDEN_ERROR";
  constructor(readonly message: string) {}
}

export function validateAuthorization(
  tenantId: string,
  authority: TransportAuthorityContext,
): EncounterServiceError | null {
  // A. Authority Context Validity
  if (!authority.clinicianId || authority.clinicianId.trim() === "") {
    return new AuthorizationError("clinicianId MUST be present and non-empty");
  }
  if (!authority.tenantId || authority.tenantId.trim() === "") {
    return new AuthorizationError("tenantId MUST be present and non-empty");
  }
  if (!authority.authorizedAt || authority.authorizedAt.trim() === "") {
    return new AuthorizationError(
      "authorizedAt MUST be valid (non-null, non-empty)",
    );
  }
  if (!authority.correlationId || authority.correlationId.trim() === "") {
    return new AuthorizationError("correlationId MUST be present");
  }

  // B. Tenant Isolation
  if (authority.tenantId !== tenantId) {
    return new ForbiddenError("authority.tenantId MUST equal request tenantId");
  }

  // C. Capability Authority Semantics
  // Capability presence already validated in transport.
  // Enforce: Capability must NOT be revoked (not applicable here as we don't have a revocation list yet)
  // Capability set must be non-empty
  if (!authority.capabilities || authority.capabilities.length === 0) {
    return new ForbiddenError("Capability set must be non-empty");
  }

  // Capability context must be structurally valid (already checked by non-empty clinicianId/tenantId/etc)

  return null;
}
