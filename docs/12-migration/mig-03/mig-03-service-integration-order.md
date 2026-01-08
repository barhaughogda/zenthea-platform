# MIG-03 – Service Integration Order (Governance)

## 1. Rationale
The integration of backend services into the Provider Portal is a high-stakes transition. A strict sequence is required to ensure that safety gates (Consent) are established before clinical data is exposed, and that read-only/draft-only postures are verified before any complex coordination logic is introduced. This order minimizes the risk of unauthorized data exposure and ensures platform stability.

---

## 2. Mandatory Integration Order

### 1. Consent Agent (The Gatekeeper)
*   **Replaced**: Mock consent responses → Real `consent-agent-sdk` calls.
*   **Explicitly Forbidden**: Loading any patient-specific clinical data before a successful consent check.
*   **Verification**: 
    ```bash
    pnpm -w lint && pnpm -w typecheck
    ```

### 2. Clinical Documentation Agent (Draft-Only)
*   **Replaced**: Static note placeholders → Real `clinical-documentation-agent-sdk`.
*   **Explicitly Forbidden**: EHR write-back, finalization of notes, or "Publish" actions.
*   **Verification**: 
    ```bash
    pnpm -w lint && pnpm -w typecheck
    ```

### 3. Medical Advisor Agent (Educational Only)
*   **Replaced**: Static advisory mocks → Real `medical-advisor-agent-sdk`.
*   **Explicitly Forbidden**: Direct patient communication, autonomous diagnostic statements, or execution of medical orders.
*   **Verification**: 
    ```bash
    pnpm -w lint && pnpm -w typecheck
    ```

### 4. Messaging Agent (Internal Clinician Messaging)
*   **Replaced**: Message list mocks → Real `chat-agent-sdk` (Clinician-to-Clinician context).
*   **Explicitly Forbidden**: External patient messaging or notification triggers to third parties.
*   **Verification**: 
    ```bash
    pnpm -w lint && pnpm -w typecheck
    ```

### 5. Appointment Booking Agent (Read-Only)
*   **Replaced**: Calendar placeholders → Real `appointment-booking-agent-sdk`.
*   **Explicitly Forbidden**: Creating, canceling, or rescheduling appointments; patient notification delivery.
*   **Verification**: 
    ```bash
    pnpm -w lint && pnpm -w typecheck
    ```

---

## 3. Stop Conditions

Integration MUST halt immediately and a rollback must be triggered if any of the following occur:
1.  **Security Breach**: Any patient data is visible without a valid `Consent Agent` check.
2.  **State Violation**: A "Draft-Only" or "Read-Only" service successfully triggers a state change in the backend.
3.  **Validation Failure**: `pnpm -w lint`, `typecheck`, or `build` fails at any point during the step.
4.  **Scope Creep**: Implementation of any feature not explicitly listed in the current integration step.

---

## 4. Final Statement

“No other integration order is permitted.”
