# Slice 02 Execution Definition: Clinical Note Read Expansion (Non-Author Access)

## 1. Purpose
The purpose of this slice is to extend the clinical note system to support secure, read-only access for authorized non-author clinicians within the same healthcare tenant. This enables collaborative care by allowing clinicians to review finalized (SIGNED) documentation authored by their peers.

## 2. Relationship to Slice 01
- **Reuse**: This slice utilizes the data structures, persistence mechanisms, and state definitions (specifically the SIGNED state) established in Slice 01.
- **Extension**: This slice expands the authorization boundary. While Slice 01 restricted all operations to the author, Slice 02 introduces a deterministic rule set for non-author read access.

## 3. Authorized Capabilities
- **Read-Only Access**: Authorized clinicians may retrieve the full content of a clinical note that is in the SIGNED state.
- **Tenant-Scoped Access**: Access is restricted to clinicians who belong to the same tenant as the clinical note.
- **Binary Authorization**: Authorization is evaluated as a single, atomic decision per request (Allow or Deny).

## 4. Explicit Prohibitions
- **No Non-Author Editing**: Non-authors are strictly prohibited from modifying any aspect of the clinical note, including metadata and content.
- **No Draft Access**: Clinical notes in the DRAFT state remain accessible only to the original author. Non-authors are denied access to DRAFT notes.
- **No Cross-Tenant Access**: Clinicians cannot access clinical notes belonging to a different tenant under any circumstances.
- **No Search/Discovery**: This slice does not provide capabilities for searching, filtering, or paginating through clinical notes.
- **No Export/Sharing**: Capabilities for printing, exporting, or sharing notes are outside the scope of this slice.
- **No Background Processing**: All operations must be synchronous and request-bound.
- **No Redaction**: Partial reads or content redaction logic are not supported; access is granted to the full note or not at all.
- **No Mutation of Slice 01**: The behavior of Slice 01 (author-centric operations) remains unchanged and must not be regressed.

## 5. Authorization Rules
1. Access is granted if and only if:
   - The requesting clinician is a member of the same tenant as the clinical note.
   - The clinical note is in the SIGNED state.
2. If the requesting clinician is the author, Slice 01 rules apply.
3. In all other cases, access is denied.

## 6. Audit Requirements
- **Emission**: A successful read operation by a non-author must emit a formal audit event.
- **Content**: Audit events must contain the Requestor ID, Target Note ID, Tenant ID, Timestamp, and Outcome.
- **Privacy**: Audit events must not contain Protected Health Information (PHI) or clinical content.

## 7. Failure Semantics
- **Fail-Closed**: Any error in authorization evaluation, tenant verification, or state checking must result in a Deny decision.
- **No Partial Success**: If any part of the retrieval process fails, the entire request must fail with no data returned to the requestor.

## 8. Out-of-Scope Clarifications
- Patient-facing access is not included in this slice.
- Administrative or "break-glass" access overrides are not included.
- Version history or audit log viewing is not included.

## 9. Slice Boundary Statement
This slice is complete when a non-author clinician can successfully read a SIGNED note from their own tenant, and is blocked from all other operations and states as defined in the prohibitions.

## 10. Lock Statement
**DESIGN-ONLY | IMMUTABLE**
This document defines the behavioral contract for Slice 02. Any deviation requires a formal architectural review.
