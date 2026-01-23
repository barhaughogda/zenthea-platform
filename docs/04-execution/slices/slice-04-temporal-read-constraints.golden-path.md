# Slice 04: Temporal Read Constraints — Golden Path Flow

## 1. Actors and Preconditions

### Actors
*   **Primary Reader**: An authenticated entity (established in Slices 01–03) requesting read access to a specific resource.
*   **Temporal Validator**: The deterministic platform component responsible for gating access based on temporal context.

### Preconditions
*   **Resource Existence**: The target resource MUST exist within the platform's persistence layer.
*   **Identity & Scope Authorization**: The requester MUST have already passed all identity and scope-based authorization gates (Slices 01–03).
*   **Immutable Validity Interval**: The target resource MUST have a defined `ValidityInterval` [Start, End).
*   **Clean State**: No pending writes or state transitions are active for the target resource.

## 2. Temporal Context Requirements
Every read request MUST be accompanied by a `TemporalContext` object containing:
*   **RequestTimestamp**: A mandatory, ISO-8601 UTC timestamp representing the moment of the request.
*   **Context Integrity**: The `TemporalContext` MUST be provided by the platform's trusted transport layer and MUST NOT be modifiable by the requester.

## 3. End-to-End Golden Path

1.  **Request Initiation**: The Primary Reader initiates a read request for a resource.
2.  **Context Attachment**: The transport layer attaches the mandatory `TemporalContext` to the request.
3.  **Identity/Scope Gate**: The platform validates the requester's identity and scope (Slices 01–03).
4.  **Temporal Retrieval**: The platform retrieves the `ValidityInterval` metadata for the target resource.
5.  **Temporal Validation**: The Temporal Validator compares the `RequestTimestamp` against the resource's `ValidityInterval`.
6.  **Authorization Grant**: The Temporal Validator confirms that `Start <= RequestTimestamp < End`.
7.  **Data Extraction**: The platform extracts the resource data from the persistence layer.
8.  **Audit Generation**: The platform generates a success-only audit record of the authorized read.
9.  **Response Delivery**: The platform delivers the resource data to the Primary Reader.

## 4. Authorization Gates (Explicit Order)
1.  **Identity Gate**: Verification of the requester's authenticated principal.
2.  **Scope Gate**: Verification that the resource falls within the requester's authorized scope.
3.  **Temporal Context Gate**: Verification that a valid `TemporalContext` is present and well-formed.
4.  **Temporal Validity Gate**: Verification that the `RequestTimestamp` is within the resource's `ValidityInterval`.

## 5. Audit Emission (Success-Only)
Upon successful completion of all authorization gates, the following evidence MUST be emitted:
*   **Event Type**: `TEMPORAL_READ_AUTHORIZED`
*   **Subject**: Requester Principal ID
*   **Object**: Resource Identifier
*   **Context**: `RequestTimestamp`
*   **Evidence**: The specific `ValidityInterval` used for the grant.

## 6. Invariants Preserved from Prior Slices
*   **Slice 01 (Transport)**: All read requests must originate from a secured transport boundary.
*   **Slice 02 (Identity)**: Requester identity must be immutable throughout the request lifecycle.
*   **Slice 03 (Scope)**: Access is strictly limited to the authorized patient/provider scope.

## 7. Explicit Non-Paths
*   **No Future-Dated Reads**: A request with a `RequestTimestamp` < `Start` is NOT a golden path.
*   **No Expired Reads**: A request with a `RequestTimestamp` >= `End` is NOT a golden path.
*   **No Missing Context**: A request without a `TemporalContext` is NOT a golden path.
*   **No Write-Through**: This flow does NOT permit any modification of the resource or its temporal metadata.
*   **No Partial Auth**: A request that passes Identity/Scope but fails Temporal Validity is NOT a golden path.
