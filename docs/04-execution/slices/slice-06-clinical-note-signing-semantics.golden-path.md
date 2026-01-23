# Slice 06: Clinical Note Signing Semantics — Golden Path Flow

## 1. Purpose
This document defines the deterministic, successful execution sequence for signing a clinical note. It formalizes the "Golden Path" from the initial signing intent to the terminal state of finality, ensuring non-repudiation and regulatory compliance through a single, immutable transition.

## 2. Golden Path Sequence

| Step | Layer | Action | Description |
| :--- | :--- | :--- | :--- |
| 1 | **Transport** | `SignNote(noteId)` | Client issues an explicit command expressing the intent to sign a specific clinical note. |
| 2 | **Authorization** | `VerifyCapability` | System verifies that the actor possesses the required capability-based authority to perform a signing operation. |
| 3 | **Service** | `ValidatePrecondition` | System confirms the clinical note is currently in the mandatory `DRAFT` state. |
| 4 | **Service** | `GenerateTimestamp` | System generates the authoritative signing timestamp using the internal system clock. |
| 5 | **Persistence** | `ApplySignature` | System atomically updates the note state from `DRAFT` to `SIGNED`, attaching the signature metadata and timestamp. |
| 6 | **Audit** | `EmitAuditEvent` | System records a success-only audit entry containing the note ID, actor capability reference, and system timestamp. |
| 7 | **Transport** | `ReturnSignedState` | System returns the finalized, immutable note state to the client. |

## 3. Execution Constraints

### 3.1 Explicit Intent
The signing operation is triggered by a distinct `SignNote` intent. This action is logically and physically separated from standard "save" or "update" operations.

### 3.2 Capability-Based Gate
Authorization is strictly enforced based on the possession of a signing capability. The system does not rely on static roles but evaluates the presence of the specific capability at the moment of execution.

### 3.3 Mandatory State Precondition
The transition to `SIGNED` is only valid if the note is in the `DRAFT` state. This is a hard gate that must be passed before any state modification occurs.

### 3.4 Authoritative Timestamping
The signature timestamp is generated exclusively by the system's authoritative clock. Client-provided timestamps are ignored to ensure the integrity of the temporal record.

### 3.5 Exactly-Once Semantics
The transition from `DRAFT` to `SIGNED` is a deterministic, one-way operation. Successful execution results in exactly one signature being applied to the note.

## 4. Terminal Finality
Upon successful completion of the persistence layer update, the clinical note enters a state of **Terminal Finality**.

*   **Irreversibility**: The note cannot be reverted to `DRAFT` or any other mutable state.
*   **Immutability**: No further modifications to the note content or metadata are permitted.
*   **Non-Repudiation**: The combination of capability-based authorization and authoritative timestamping establishes a permanent record of the signing event.

## 5. Audit Emission
The audit record emitted at the conclusion of the Golden Path is metadata-only. It captures the "who, what, and when" of the signing event without duplicating the clinical content of the note.
