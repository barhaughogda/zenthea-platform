# Phase J.7.9 — Authorization Boundary Definition (DESIGN-ONLY)

## 1. Purpose
This phase formally defines the **authorization boundary** of the platform.

Its objectives are to:
- Establish **authorization as a boundary concern**, not a business capability.
- Prevent the introduction of implicit, inferred, or distributed authorization logic.
- Preserve deterministic, fail-closed execution suitable for regulated clinical systems.
- Ensure authorization decisions are **auditable, reviewable, and non-leaky**.

This phase defines **where authorization occurs**, not **how authorization is implemented**.

## 2. Authorized Scope

### 2.1 Authorization Boundary Placement
Authorization is permitted **only at a single, explicit boundary** immediately following authentication and prior to any service execution.

Authorize:
- Authorization evaluated **after successful authentication**.
- Authorization evaluated **before any service-layer invocation**.
- Exactly **one authorization decision per request**.
- Authorization treated as a **gate**, not a filter.

Explicitly forbid:
- Authorization logic inside:
  - Domain logic (`ehr-core`)
  - Service implementations
  - Persistence adapters
  - Transport routing or handlers beyond the defined boundary
- Multiple authorization decisions per request.
- Conditional, chained, or layered authorization checks.
- Authorization embedded in business rules or data access logic.

### 2.2 Authorization Inputs
Authorization decisions may rely **only** on explicitly provided inputs.

Authorize:
- `AuthorityContext` as the **sole authorization signal**.
- Explicit resource identifiers supplied by the caller.
- Explicit tenant identifier supplied by the caller.

Explicitly forbid:
- Implicit role derivation.
- Context enrichment or mutation.
- Authorization based on request metadata not explicitly declared.
- Cross-resource inference (e.g. deriving access to one resource via another).
- Authorization based on data content.

### 2.3 Authorization Outputs
Authorization produces a **binary decision** only.

Authorize:
- Allow or deny outcome.
- Structured authorization failure errors that are:
  - Deterministic
  - Non-descriptive
  - Non-leaking

Explicitly forbid:
- Partial authorization.
- Conditional access.
- Data shaping, filtering, or redaction based on authorization.
- Silent denial or degraded success.
- Authorization outcomes influencing business logic.

### 2.4 Failure Semantics
Authorization failures **must halt execution immediately**.

Mandate:
- Fail-closed behavior on:
  - Missing authority
  - Invalid authority
  - Ambiguous authority
  - Missing resource context
- No retries, fallbacks, or defaults.
- No recovery paths within the same request.

## 3. Security & Privacy Constraints
Authorization logic must preserve strict confidentiality guarantees.

Mandate:
- No PHI or PII in authorization inputs, rules, or outputs.
- No logging of authorization signals.
- No exposure of permission structure, roles, or decision rationale.
- Error responses must not reveal authorization internals.

## 4. Explicitly Forbidden (Hard Prohibitions)
The following are **explicitly disallowed** in this phase:

- RBAC implementations
- ABAC implementations
- Policy engines (OPA, Cedar, etc.)
- Permission schemas
- Role definitions
- Scope definitions
- Condition evaluation logic
- Rule evaluation logic
- Any executable code
- Any configuration files
- Any persistence or caching
- Any framework-specific authorization features

## 5. Phase Boundaries
- Phase **J.7.9 defines the authorization *boundary*, not the authorization *model***.
- No authorization behavior may be implemented under this phase.
- Any concrete authorization system requires a **future Phase J.8.x** with explicit approval.

## 6. Lock Statement
- Phase J.7.9 is **DESIGN-ONLY**.
- Phase J.7.9 is **FINAL and IMMUTABLE** once approved.
- Any deviation requires a formal governance amendment.

## Regulatory Rationale
This phase ensures:
- Authorization decisions are **predictable, auditable, and reviewable**.
- No hidden or emergent authorization logic can arise.
- The system remains compliant with **clinical safety, least privilege, and privacy principles**.
