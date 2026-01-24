# Golden Path: Encounter Slice 03 — Temporal & State Visibility Constraints

## 1. Context Establishment
1. The system verifies the presence of a valid and active tenant context for the incoming request.
2. The system confirms that all authorization and capability requirements defined in Slice 02 have been successfully satisfied.

## 2. Temporal Validation
1. The system extracts the explicit request timestamp from the request metadata.
2. The system validates that the request timestamp is well-formed and adheres to the required temporal precision.
3. The system compares the request timestamp against the Encounter’s defined temporal window.
4. The system confirms the request timestamp falls strictly within the permitted temporal boundaries of the Encounter.
5. The system performs this validation without reliance on fallback mechanisms or local system clock references.

## 3. State Visibility Validation
1. The system retrieves the current lifecycle state of the Encounter as defined by Slice 01.
2. The system verifies that the Encounter lifecycle state is explicitly present and matches one of the permitted visible states.
3. The system rejects any state evaluation based on transitional, inferred, or indeterminate state logic.

## 4. Visibility Resolution
1. The system grants visibility to the Encounter only upon the successful completion of all temporal and state validation checks.
2. The system ensures no mutation of the Encounter state or associated data occurs during the visibility resolution process.
3. The system executes the visibility resolution without partial evaluation or premature access to the persistence layer.

## 5. Audit Emission
1. The system emits exactly one audit event following the successful resolution of Encounter visibility.
2. The system ensures the audit event is emitted only after visibility has been fully granted.
3. The system populates the audit event payload with metadata-only attributes, excluding any sensitive clinical or personal data.
