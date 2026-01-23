# Slice 02: Clinical Note Read Expansion - Implementation Sequencing

**Classification: DESIGN-ONLY**  
**Status: FINAL / IMMUTABLE**  
**Phase: Planning / Sequencing**

---

## 1. Document Classification
This document is classified as **DESIGN-ONLY**. It serves as the authoritative blueprint for the implementation sequence of Slice 02. No implementation, coding, or environment modification is performed during the creation or verification of this document.

## 2. Purpose
The purpose of this document is to define the strictly permitted order and scope for the implementation of Slice 02 (Clinical Note Read Expansion). Slice 02 extends the retrieval behavior established in Slice 01 to allow non-author clinicians within the same clinical context to read notes. This document ensures that the expansion of read access is handled with precision, maintaining all security and integrity guarantees established in Slice 01.

## 3. Scope of Change

### 3.1 Permitted Changes (MAY Change)
- **Authorization Logic**: The `readNote` operation's authorization boundary may be updated to include logic for verifying clinician membership within the relevant clinical context.
- **Service-Layer Access Rules**: Logic within the service layer that previously restricted reads to the author only may be expanded to permit non-author clinicians who meet the authorization criteria.

### 3.2 Prohibited Changes (MUST NOT Change)
- **Transport Layer**: No changes to API routes, DTO shapes, or request/response structures are permitted.
- **Persistence Layer**: No changes to database schemas, data models, or storage mechanisms are permitted.
- **Audit Logging**: The structure and payload of audit events must remain unchanged.
- **Slice 01 Behavior**: All existing guarantees for author-based reads established in Slice 01 must remain intact and functional.

## 4. Layer-by-Layer Sequencing
Implementation must proceed in the following non-negotiable order. Each step must be verified before proceeding to the next.

1.  **Authorization Boundary Adjustments**: Update the authorization logic to permit non-author clinician access based on context membership.
2.  **Service Logic Changes**: Modify the internal service logic to honor the expanded authorization rules while maintaining Slice 01 constraints.
3.  **Audit Emission Validation**: Verify that audit events are correctly emitted for both author and non-author reads, maintaining the existing schema.
4.  **Contract Test GREEN Verification**: Execute the full suite of Slice 02 contract tests to ensure compliance with the defined requirements.

**Constraints:**
- No persistence changes are permitted.
- No transport changes are permitted.
- No new roles or permission systems are permitted.

## 5. Test-Driven Gates
Implementation proceeds strictly on a test-by-test basis following the RED → GREEN cycle. Refactoring or batching of implementation tasks is prohibited.

Implementation is governed by the following contract tests defined in `slice-02-clinical-note-read-expansion.test-matrix.md`:
- **S02-TM-01**: Non-author clinician in same context reads note (Success)
- **S02-TM-02**: Non-author clinician in different context attempts read (Failure)
- **S02-TM-03**: Non-clinician user attempts read (Failure)
- **S02-TM-04**: Author clinician reads note (Success - Regression)
- **S02-TM-05**: Audit emission for non-author read (Success)
- **S02-TM-06**: Context membership verification (Success)
- **S02-TM-07**: Invalid note ID handling (Failure - Regression)
- **S02-TM-08**: Unauthorized role handling (Failure)
- **S02-TM-09**: Deleted note read attempt (Failure - Regression)
- **S02-TM-10**: Concurrent read performance/integrity (Success)

## 6. Prohibitions
The following actions and architectural patterns are strictly forbidden for Slice 02:
- **Broad Role Systems**: Implementation of generalized RBAC or role-based systems beyond the specific clinician context requirement.
- **ACL Tables**: Introduction of Access Control List tables or similar persistence-based permission structures.
- **Feature Flags**: Use of toggles or flags to control the rollout of this behavior.
- **Soft Authorization**: Any form of authorization that does not occur at the strict service boundary.
- **Backwards-Incompatible Behavior**: Any change that breaks Slice 01 contracts or existing client integrations.
- **Modifying Slice 01 Tests**: Existing tests for Slice 01 must remain unchanged and must pass at all times.

## 7. Completion Criteria
Slice 02 is defined as complete only when the following conditions are met:
- All Slice 02 contract tests (S02-TM-01 through S02-TM-10) are GREEN.
- All Slice 01 contract tests remain GREEN.
- No new failing tests exist in the suite.
- The working tree is clean.
- All changes are isolated to the specific feature branch for Slice 02.

## 8. Lock Statement
This implementation sequencing plan is **FINAL** and **IMMUTABLE**. Once committed, any deviation from this plan requires the definition of a new slice or a formal revision process.
