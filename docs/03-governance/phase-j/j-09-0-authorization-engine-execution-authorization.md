# Phase J.9.0 — Authorization Engine Execution Authorization

## 1. Purpose
This document authorizes the first executable implementation of the ZenThea authorization engine. It distinguishes execution authorization from integration authorization, enabling the development of the core evaluation logic. This phase enables deterministic policy evaluation ONLY and does not authorize external connectivity or integration.

## 2. Authorized Scope
Implementation of an authorization engine is authorized as a pure deterministic function. The engine must:
- Evaluate policies as a pure deterministic function.
- Consume ONLY:
  - Phase J.8.1: Attribute taxonomy
  - Phase J.8.2: AuthorityContext semantics
  - Phase J.8.6: Policy representation
  - Phase J.8.10: Policy loading contract
  - Phase J.8.11: Evaluation wiring
- Produce a binary decision only: `ALLOW` or `DENY`.
- Fail closed on:
  - Missing attributes
  - Ambiguous attributes
  - Missing or invalid policy
  - Runtime errors
  - Non-deterministic conditions

## 3. Explicitly Authorized Artifacts
The following artifacts are authorized for creation:
- Authorization engine source code (pure logic only).
- Deterministic evaluation functions.
- Typed authorization error structures.
- Unit tests proving determinism, purity, and fail-closed behavior.

## 4. Explicit Prohibitions (Hard)
The following actions and features are STRICTLY FORBIDDEN during this phase:
- Transport integration (e.g., HTTP, gRPC).
- Service integration.
- Persistence access (direct database or disk access).
- Caching of decisions or attributes.
- Policy mutation or runtime reload (logic must be static during evaluation).
- Async execution or multithreading within the engine logic.
- Time-based logic or reliance on system clocks.
- Feature flags or dynamic configuration toggles.
- Environment-driven behavior (e.g., `process.env` checks).
- Network access.
- Logging, metrics, tracing, or audit sinks.
- PHI or PII handling (attributes must be de-identified).
- Role-based shortcuts (RBAC logic outside the attribute model).
- Authorization outside the boundary defined in Phase J.7.9.

## 5. Determinism & Safety Invariants
The implementation must adhere to these invariants:
- Referential transparency: The engine must be a pure function.
- Identical output for identical input: Re-evaluating the same context and policy must yield the same decision.
- No randomness, clocks, I/O, or global state.
- No implicit defaults: All decisions must be explicitly derived from policy.
- Fail-closed behavior on any uncertainty or internal failure.

## 6. Regulatory & Privacy Constraints
- No PHI or PII may be processed by the authorization logic.
- Policies must not encode patient-specific data or identifiable information.
- Errors must not reveal missing attributes, policy structure, or decision rationale to avoid information leakage.
- Auditability must be achievable via code inspection and deterministic unit tests alone.

## 7. Phase Boundary
This phase does NOT authorize runtime wiring, enforcement points, or transport exposure. The engine remains an isolated logical component. Follow-on integration (wiring the engine into the request flow) requires a future J.9.x phase.

## 8. Lock Statement
Phase J.9.0 is EXECUTION-AUTHORIZED and SCOPE-LOCKED. Any deviation from the scope or prohibitions defined herein requires a new governance phase.
