# Slice 07 Lock Note — Post-Sign Read Semantics

## Classification
- **Slice**: 07
- **Name**: Post-Sign Read Semantics
- **Status**: FINAL, HARDENED, IMMUTABLE
- **Type**: DESIGN-ONLY GOVERNANCE LOCK

## Artifact Scope
This lock is explicitly bound to the following Slice 07 artifacts and the foundation blueprint:
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.definition.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.golden-path.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.failure-matrix.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.test-matrix.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.implementation-sequencing.md`
- `docs/04-execution/slices/slice-00-reference-blueprint.md`

## Hard Invariants
The following invariants are absolute and must be enforced without exception:
- **Signed-Only Access**: Only SIGNED clinical notes may be read.
- **Strictly Read-Only**: Read operations are strictly read-only; no state mutation allowed.
- **Capability-Based Access**: Access is controlled via capability-based identifiers only (no role-based logic).
- **Mandatory Temporal Constraints**: Temporal constraints (e.g., expiration, valid-from) are mandatory.
- **Signature Integrity**: Signature integrity verification is mandatory for every read.
- **Absolute Tenant Isolation**: Tenant isolation is absolute and must be verified at the infrastructure/data layer.
- **Fail-Closed**: Any violation of invariants or security checks must result in an immediate fail-closed state.
- **Zero Failure Audit**: Zero audit emission on failure to prevent information leakage.
- **Success Audit**: Exactly one metadata-only audit event on successful read.

## Prohibitions
The following actions and patterns are strictly forbidden:
- **Draft/Pre-Sign Reads**: Reading clinical notes in draft or pre-signed state.
- **Post-Sign Mutation**: Any mutation of a note after it has been signed.
- **Administrative Bypass**: Any administrative or "super-user" bypass of these semantics.
- **Role-Based Exceptions**: Any exceptions based on user roles or groups.
- **Partial Reads**: Partial or masked reads of the clinical note content.
- **Retry Logic**: Automatic retry logic on security or invariant failures.
- **Background Processing**: Background or asynchronous processing of these read operations.
- **Silent Degradation**: Silent degradation of security or integrity checks.

## Immutability Declaration
- Slice 07 semantics are now frozen and immutable.
- Any change to these semantics requires the definition and locking of a NEW slice.
- Prior slices (01–06) are not modified or affected by this lock.

## Lock Statement
Slice 07 is hereby declared:
- **FINAL**
- **GOVERNED**
- **IMMUTABLE**
