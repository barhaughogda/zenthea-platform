# Phase J.9.1 — Authorization Engine Test Harness Authorization

## 1. Purpose
This document authorizes the creation of a deterministic test harness for the authorization engine implemented in Phase J.9.0. The sole purpose of this phase is to produce correctness and safety evidence. This phase does NOT authorize integration, enforcement, or runtime wiring.

## 2. Authorized Scope
Authorization is granted for a standalone test harness that invokes the authorization engine as a pure function. The harness is restricted to:
- Synthetic `AuthorityContext` inputs only.
- Synthetic attributes derived strictly from:
  - Phase J.8.1: Attribute taxonomy.
  - Phase J.8.2: AuthorityContext semantics.
- Synthetic policies conforming strictly to:
  - Phase J.8.6: Policy representation.
  - Phase J.8.10: Policy loading contract.

## 3. Mandatory Test Categories
The test harness must validate the following categories:
- **Determinism**: Identical input must always result in the identical output.
- **Fail-closed behavior**: Evaluation must result in `DENY` for:
  - Missing attributes.
  - Ambiguous attributes.
  - Missing policy.
  - Invalid policy.
  - Internal evaluation errors.
- **Purity**: Verification that no clocks, randomness, I/O, environment variables, or global state influence the outcome.
- **Completeness**: All declared attributes and operators must be exercised by the harness.
- **Negative assurance**: No partial or degraded authorization outcomes are permitted; decisions must be binary.

## 4. Outputs
The test harness must produce:
- **Binary decision only**: `ALLOW` | `DENY`.
- **Typed, internal test-only error representations** for diagnostic purposes within the test environment.

## 5. Explicitly Authorized Artifacts
The following artifacts are authorized for creation:
- Unit test source code.
- Deterministic test vectors.
- Golden test cases (input/output pairs).
- Property-style tests.
- Test-only helper utilities (must be pure, local, and perform no I/O).

## 6. Explicit Prohibitions (HARD)
The following are STRICTLY FORBIDDEN:
- Transport frameworks (e.g., HTTP, gRPC).
- Service layer usage or integration.
- Enforcement logic.
- Persistence, caching, or memoization.
- Async execution, concurrency, or parallelism.
- Logging, metrics, tracing, or audit sinks.
- Policy mutation or reload during tests.
- Snapshot tests encoding policy structure (structural coupling).
- Real identities, Protected Health Information (PHI), or Personally Identifiable Information (PII).
- Any code reusable in production runtime (test code must remain in test-only directories).

## 7. Regulatory & Clinical Safety Constraints
- Tests must be reproducible and deterministic across all execution environments.
- No test output may reveal internal policy structure or authorization rationale.
- Any evaluation failure must immediately halt processing and result in a `DENY` decision.
- Auditability of the authorization logic must be achievable via code inspection and test results alone.

## 8. Phase Boundary
- Phase J.9.1 validates the authorization engine logic ONLY.
- Phase J.9.2 is required for any authorization enforcement wiring.
- No integration with other system components is permitted in this phase.

## 9. Lock Statement
Phase J.9.1 authorizes execution of tests only. Phase J.9.1 is FINAL and IMMUTABLE once approved.
