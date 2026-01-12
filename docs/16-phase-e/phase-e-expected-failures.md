# Phase E: Expected Failures & Deterministic Denials

This document outlines the expected failure scenarios for Phase E sealed slices (SL-04, SL-07, SL-08) and the governing gates that enforce them. In Phase E, failures are first-class citizens of the UX and must be rendered verbatim to ensure observability of the non-execution posture.

## SL-04: Clinician Drafting

| Failure Scenario | Enforcing Gate | Expected Outcome | Why Correct & Desired |
|------------------|----------------|------------------|-----------------------|
| Invalid Tenant Access | Tenant Gate | DENY | Clinicians must only draft within their assigned tenant boundary. Cross-tenant drafting is a critical security violation. |
| Expired Session | SL-01 (Auth) | DENY/ERROR | Ensuring all drafting operations are performed under a valid, recently-verified session prevents stale permission attacks. |
| Unauthorized Actor Type | SL-03 (Policy) | DENY | Drafting must only be performed by actors with the `CLINICIAN` role. Patients or external actors cannot access drafting tools. |

## SL-07: Patient Scheduling Proposal

| Failure Scenario | Enforcing Gate | Expected Outcome | Why Correct & Desired |
|------------------|----------------|------------------|-----------------------|
| Request for Another Patient | SL-03 (Policy) | DENY | Patients can only generate proposals for their own ID. Horizontal privilege escalation is blocked at the orchestration layer. |
| Missing Intent | Validation | ERROR | The AI runtime requires a clear patient intent to reason about scheduling. Empty inputs are caught before processing. |
| Tenant Mismatch | Tenant Gate | DENY | Proposals must originate from and target the same tenant as the patient's session. |

## SL-08: Provider Review

| Failure Scenario | Enforcing Gate | Expected Outcome | Why Correct & Desired |
|------------------|----------------|------------------|-----------------------|
| Unauthorized Reviewer | SL-03 (Policy) | DENY | Only authorized providers within the specific tenant can approve or reject proposals. |
| Missing Rejection Reason | SL-08 (Logic) | ERROR | To maintain a valid clinical audit trail, all rejections MUST include a reason code. The system fails closed if this is missing. |
| Action on Finalized Proposal | SL-08 (State) | DENY | Deterministic state machine enforcement ensures that proposals already ACCEPTED or REJECTED cannot be modified again. |

## Observability Standards

All denials and errors in Phase E Demo UI follow these standards:
1. **Verbatim Rendering**: Error messages and JSON payloads from the orchestration layer are rendered exactly as received, without reinterpretation.
2. **Gate Visibility**: The specific gate that blocked the execution (e.g., SL-01, Tenant Gate) is explicitly identified.
3. **Non-Execution Posture**: UI state clearly distinguishes between a system failure (ERROR) and a deterministic policy refusal (DENY).
