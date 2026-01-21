# Phase J.9.2 — Authorization Enforcement Wiring Authorization

## 1. Purpose
- Authorize the wiring of authorization decisions to request execution.
- Define the exact enforcement point for authorization decisions.
- This phase defines *where and when* authorization is enforced, not *how* authorization is evaluated.

## 2. Authorized Scope
- Bind the authorization engine (Phase J.9.0) to the single enforcement boundary defined in Phase J.7.9.
- Enforcement MUST occur:
  - After authentication
  - Before any service invocation
  - Exactly once per request
- Authorization decisions MUST be binary: ALLOW or DENY.
- DENY MUST halt execution immediately.

## 3. Authorized Inputs
Authorization enforcement may consume ONLY:
- AuthorityContext
- Explicit tenant identifier
- Explicit resource identifiers supplied by the caller

Explicitly forbid:
- Implicit inference
- Context enrichment
- Attribute mutation
- Cross-resource derivation
- Authorization based on request metadata not explicitly declared

## 4. Authorized Outputs
- ALLOW → request proceeds
- DENY → request terminates immediately
- Errors MUST be:
  - Deterministic
  - Non-descriptive
  - Non-leaking
- No partial success, filtering, or redaction is permitted.

## 5. Explicitly Authorized Artifacts
- Enforcement boundary wiring code
- Authorization middleware or boundary adapter
- Deterministic error mapping consistent with Phase I
- Enforcement-only unit tests verifying:
  - Execution halts on DENY
  - Zero service execution on denied requests
  - Fail-closed behavior on missing or invalid inputs

## 6. Explicitly Forbidden (HARD)
- Any modification to:
  - Authorization model
  - Attribute taxonomy
  - AuthorityContext structure
  - Policy representation
  - Policy storage or loading
- Authorization logic inside:
  - Services
  - Domain logic
  - Persistence adapters
- Multiple authorization checks per request
- Async or background enforcement
- Logging, metrics, tracing, or audit sinks
- Exposure of authorization rationale
- PHI or PII in enforcement paths

## 7. Safety & Regulatory Constraints
- Enforcement MUST be fail-closed under all failure modes.
- Authorization denial MUST:
  - Halt execution immediately
  - Produce no side effects
  - Leave no observable partial state
- Enforcement MUST be deterministic, auditable by code inspection, and reproducible across environments.

## 8. Phase Boundary
- Phase J.9.2 authorizes enforcement wiring ONLY.
- No authorization behavior changes are permitted.
- Phase J.9.3 is required for audit emission or authorization observability.

## 9. Lock Statement
- Phase J.9.2 is EXECUTION-AUTHORIZED and SCOPE-LOCKED.
- This authorization is FINAL and IMMUTABLE unless amended via formal governance.
