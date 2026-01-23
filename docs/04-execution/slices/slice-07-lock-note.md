# GOVERNANCE LOCK NOTE: Slice 07 — Post-Sign Read Semantics

## 1. IMMUTABILITY DECLARATION
Slice 07 (Post-Sign Read Semantics) is hereby declared **FINAL**, **HARDENED**, and **IMMUTABLE**. This governance specification defines the canonical requirements for reading clinical notes after a formal signature has been applied. No further design modifications are permitted.

## 2. CANONICAL READ SEMANTICS
The following governance constraints are absolute and must be enforced by the system without exception:

### 2.1. Signature Requirement
- ONLY clinical notes in a **SIGNED** state may be accessed via the post-sign read path.
- Verification of signature presence and cryptographic integrity is mandatory prior to data release.

### 2.2. Enforcement Matrix
- **Temporal Constraints**: All temporal read constraints defined in Slice 04 must be strictly enforced.
- **Access Control**: Capability-based access control (CBAC) is mandatory. Access is granted based on explicit capabilities, not implicit roles.
- **Audit Integrity**: 
  - Exactly **ONE** `NOTE_READ` audit event must be emitted upon every successful read operation.
  - **ZERO** audit events must be emitted on any read failure to prevent audit log pollution and reconnaissance.

## 3. GOVERNANCE PROHIBITIONS
The following behaviors are strictly prohibited and must be prevented by the system architecture:
- **Role-Based Bypasses**: No user role, including administrative or emergency roles, may bypass signature verification or capability checks.
- **Administrative Overrides**: No administrative override mechanisms are permitted for post-sign read semantics.
- **Partial Reads**: The system must not permit partial reads of note content; the note must be retrieved in its entirety or not at all.
- **Post-Sign Mutation**: Once a note is signed and accessed via this path, any mutation of the record is strictly prohibited.
- **Silent Degradation**: The system must not silently degrade security checks or perform automatic retries on integrity failures.

## 4. ARTIFACT REFERENCE
This Lock Note hardens the following Slice 07 governance artifacts:
- `docs/04-execution/slices/slice-00-reference-blueprint.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.definition.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.golden-path.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.failure-matrix.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.test-matrix.md`
- `docs/04-execution/slices/slice-07-post-sign-read-semantics.implementation-sequencing.md`

## 5. GOVERNANCE ATTESTATION
This specification serves as the authoritative governance record for Slice 07. Implementation must adhere strictly to these requirements to maintain the integrity of the Zenthea clinical record system.
