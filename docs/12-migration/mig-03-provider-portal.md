# MIG-03 — Provider Portal (Execution Contract)

**Status:** Approved  
**Contract Type:** Execution Contract (binding)  
**Owner:** Migration Roadmap Owner  

## 1. Purpose

MIG-03 establishes a **Provider Portal** that serves as the clinician-facing entry point for provider workflows, with a strictly constrained scope suitable for regulated delivery.

This document is the **authoritative execution contract** for MIG-03. Any activity not explicitly permitted here is out of scope.

## 2. Authoritative context (must-read)

The conceptual decomposition and target boundaries for the legacy “company” route are defined in:

- `docs/12-migration/mig-03-company-decomposition.md` (**authoritative context for boundaries and target decomposition**)

This execution contract MUST NOT contradict that decomposition. If any apparent contradiction is discovered, the work MUST halt per the Stop Conditions in §7.

## 3. Scope (explicit and limited)

MIG-03 scope is limited to the following three areas only:

1. **Provider Portal UI shell**
   - A clinician-facing application shell that provides navigation, identity/session context, and a coherent UX entry point for provider workflows.
2. **Legacy provider-facing UI migration**
   - Migration of legacy **provider-facing** UI surfaces into the Provider Portal, limited to the constraints in §4.
3. **Read-only and draft-first workflows only**
   - All migrated or newly introduced workflows MUST be either:
     - **Read-only**, or
     - **Draft-first** (draft creation/editing permitted; downstream execution and finalization prohibited unless explicitly allowed by this contract).

## 4. Mandatory constraints (safety and regulatory posture)

The following constraints are mandatory:

- **No irreversible operations**: MIG-03 MUST NOT introduce irreversible, externally-visible actions (including but not limited to message sending, appointment execution, billing execution, or EHR write-back).
- **Draft-first is not execution**: Draft creation/editing MUST NOT trigger downstream side effects. Drafts MUST be explicitly identifiable as drafts.
- **Least privilege**: Integrations MUST operate with least-privilege access, consistent with read-only and draft-first behavior.
- **No implicit expansion**: “Small additions” to enable workflows are not permitted if they violate §3 or §5.

## 5. Non-goals (explicit exclusions)

The following are explicit non-goals of MIG-03 and MUST NOT be implemented, partially implemented, or implicitly introduced through “temporary” behavior:

- **No billing logic** (invoicing, payments, reconciliation, credits/adjustments, financial reporting)
- **No appointment execution** (booking, rescheduling, cancellation, reminders, availability mutation)
- **No messaging delivery** (sending, deliverability, notification dispatch, inbox queue execution)
- **No EHR write-back** (creating/updating clinical records in an EHR or equivalent system of record)
- **No autonomous AI behavior** (no self-initiated actions, no background agents executing tasks, no automated decisions without explicit user initiation and review)

## 6. Mandatory service integration order (and limitations)

If service integrations are performed within MIG-03, they MUST follow the order below. Skipping ahead is prohibited. Adding additional services is prohibited unless this contract is amended.

1. **`consent-agent`**
   - MUST be integrated first.
   - Role: consent visibility and consent-aware gating for provider workflows.

2. **`clinical-documentation-agent` (drafts only)**
   - MUST be integrated second.
   - Role: draft clinical documentation creation/editing only.
   - MUST NOT perform finalization, submission, or write-back to a system of record.

3. **`appointment-booking-agent` (read-only)**
   - MUST be integrated third.
   - Role: read-only visibility into appointments/scheduling state only.
   - MUST NOT execute booking operations, rescheduling, cancellation, reminders, or any state mutation.

4. **`medical-advisor-agent` (last, advisory only)**
   - MUST be integrated last.
   - Role: advisory support only.
   - MUST NOT initiate actions, MUST NOT execute workflows, and MUST NOT write back to any system of record.

## 7. Stop conditions (mandatory halt)

Any of the following conditions MUST trigger an immediate halt of MIG-03 work until explicitly resolved and approved:

- **Scope breach**: Any requirement, ticket, PR, or change introduces behavior outside §3 or violates §5.
- **Execution side effects**: Any implementation causes side effects beyond read-only or draft-first behavior (including message delivery, appointment execution, billing execution, or EHR write-back).
- **Integration order violation**: Any attempt to integrate services out of order (per §6) or introduce additional services without contract amendment.
- **Autonomy introduced**: Any autonomous/agentic behavior is added (background execution, self-triggered actions, automated decisions without explicit provider initiation and review).
- **Authorization uncertainty**: Unresolved questions about permissions, access control, or data exposure that could increase regulatory or security risk.
- **Contract conflict**: Any contradiction or ambiguity between this execution contract and `mig-03-company-decomposition.md`.
- **Boundary creep**: Any attempt to expand MIG-03 into other domain apps or workflows (messaging, appointments execution, billing/accounting, reporting/analytics), even “temporarily.”

Resumption requires an explicit decision and documented amendment, or a documented determination that the stop condition was a false positive.

## 8. Explicit exclusions: future apps are NOT part of MIG-03

Per the target decomposition in `mig-03-company-decomposition.md`, MIG-03 does not implement any app other than the Provider Portal shell and its constrained provider-facing UI migration.

The following are explicitly NOT part of MIG-03:

- `messaging` (future app)
- `appointments` (future app; beyond read-only visibility)
- `billing/accounting` (future app)
- `reports/analytics` (future app)
- Any other future application or domain surface not explicitly included in §3
