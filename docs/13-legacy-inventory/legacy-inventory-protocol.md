# Legacy Inventory Protocol (Phase B)

**Status**: Authoritative (Governance-Binding)  
**Applies to**: Phase B — Legacy Repository Analysis  
**Protocol Version**: 1.0.0  
**Effective Date**: 2026-01-09  

## 1. Purpose
The purpose of this protocol is to define a deterministic, audit-ready, and fail-closed methodology for identifying and documenting legacy assets within the `../dev/zenthea` and `../b2b-startkit` repositories. This protocol ensures that the analysis phase remains purely observational and does not prematurely influence the forward-moving architecture of the `zenthea-platform`.

## 2. Scope
### 2.1. What Inventory IS
*   **Asset Cataloging**: The identification of specific files, directories, and logic fragments that represent "Original Intent."
*   **Read-Only Observation**: The act of viewing legacy code to understand business rules without evaluating its technical merit.
*   **Traceability Mapping**: Establishing a clear link between a legacy business requirement and its location in the legacy source.

### 2.2. What Inventory IS NOT
*   **Architecture Inference**: Inventory MUST NOT extract deployment patterns, security models, or infrastructure configurations.
*   **Code Quality Assessment**: Legacy code quality is assumed to be "Compromised" by default; inventory is not an exercise in code review.
*   **Migration**: The act of moving or refactoring code.

## 3. Allowed Actions
The following actions are permitted under this protocol:
1.  **Passive Inspection**: Reading legacy source files for the sole purpose of extracting domain logic.
2.  **Metadata Capture**: Recording file paths, filenames, and line numbers of relevant business logic.
3.  **Conflict Identification**: Noting where `b2b-startkit` and `dev/zenthea` provide conflicting domain rules.
4.  **Reference Verification**: Confirming the existence of a feature or rule cited in historical documentation.

## 4. Prohibited Actions
The following actions are strictly forbidden and constitute a protocol violation:
1.  **Pattern Replication**: Using legacy directory structures, naming conventions, or design patterns as templates for the new platform.
2.  **Automated Scanning**: The use of broad, unguided grep or LLM-based code-scanning tools without specific, pre-approved target areas.
3.  **Conflict Resolution**: Attempting to "fix" or "decide" between conflicting legacy sources. All conflicts must be marked as `STALLED`.
4.  **Assumed Ownership**: Inferring system ownership or data classification without explicit evidence from the `zenthea-platform` Architect.
5.  **Blueprint Generation**: Creating UML diagrams or flowcharts based on legacy implementation rather than legacy domain intent.

## 5. Evidence Standards
All inventory entries must meet the following criteria to be considered valid:
*   **Citations**: Must include the repository name (`dev/zenthea` or `b2b-startkit`), the full file path, and the specific git commit hash analyzed.
*   **Objectivity**: Observations must be stated as literal facts (e.g., "File X contains a function that calculates Y") rather than interpretations.
*   **Verifiability**: A third-party auditor must be able to locate the exact same fragment using the provided citation.

## 6. Stop Conditions
Inventory activities must cease immediately if any of the following occur:
1.  **PII/PHI Discovery**: Detection of unmasked Protected Health Information or Personally Identifiable Information in legacy source code or metadata.
2.  **Logic Deadlock**: Identification of a domain rule that is critical but fundamentally contradictory across all sources, requiring an Architect's intervention.
3.  **Standard Violation**: Discovery that the legacy asset being analyzed is so far removed from `zenthea-platform` standards that further analysis risks "mental leakage" of deprecated patterns.

## 7. Roles & Accountability
*   **Inventory Executor**: Responsible for performing the inventory according to this protocol and providing compliant evidence.
*   **Governance Lead (Auditor)**: Responsible for verifying that inventory entries adhere to the "Explicitly Conservative" tone and do not contain prohibited inferences.
*   **System Architect**: The only role authorized to move an item from `STALLED` to `RESOLVED` by defining a new standard in `zenthea-platform`.

## 8. Relationship to the Legacy Source Register
This protocol is the execution mechanism for Section 7 of the `Legacy Source Register`.
*   Inventory results are used to populate the "Register" section (Section 8) of the `Legacy Source Register`.
*   Every entry in the Register must have been generated following this Protocol.

## 9. Explicit Non-Goals
*   This protocol does NOT provide a timeline for migration.
*   This protocol does NOT guarantee that any inventoried asset will be migrated.
*   This protocol does NOT attempt to improve the legacy system.
*   This protocol does NOT resolve technical debt in the legacy repositories.

---
*End of Protocol Document*
