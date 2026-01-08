# MIG-04B: Clinical Documentation (Controlled Commit and Sign)

> [!CAUTION]
> **STOP**: Do not implement until explicitly approved.

- **Status**: Draft (Not Approved)
- **ID**: MIG-04B
- **Category**: Migration
- **Focus**: Controlled commit, signing, legal record creation

## 1. Purpose
MIG-04B enables the transition from AI-generated drafts (MIG-04A) to official, immutable, and legally binding clinical documentation. This slice introduces the "write" path for clinical data.

## 2. Dependencies
- **MIG-04A Completed & Sealed**: All drafting and review logic must be hardened.
- **CP-17 Exercised**: Controlled mutations must be enforced at the API level.
- **CP-20 Connectors Ready**: External EHR and interop connectors must be verified.
- **Explicit Approvals**: Human-in-the-loop sign-off on the transition to "live" status.
- **Audit Persistence**: Immutable audit logs for the act of signing.

## 3. Non-Goals
- **No Autonomous Commit**: AI agents cannot finalize or commit clinical records.
- **No AI Signing**: The act of signing must be performed by a credentialed human operator.
- **No Bypass**: No bypass of the approval or escalation signals defined in CP-08.
