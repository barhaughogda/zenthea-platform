# Governance: Phase R Demo Freeze & Canonical Walkthrough

## 1. Governance Declaration
This document formally freezes the Phase R demo environment as a governed, non-executing reference surface. All behavior, panel orders, framing logic, and narrative sequences are locked. Any modification to this artifact requires formal governance review and approval.

## 2. Canonical Walkthrough Definition
The following sequence defines the single, authoritative walkthrough for Phase R. Deviations or improvisations during presentation are prohibited.

### Step 1: Landing Gate Selection
- **Audience Sees**: A clean, neutral entry gate requiring explicit selection of Perspective and Mode.
- **Audience Must Understand**: The demo is intentional and scoped. No defaults exist; the user must choose how the system should be observed.
- **Explicitly NOT Happening**: No authentication, no session persistence beyond the current tab, no database connection.

### Step 2: Patient Scenario (Read-Only Intelligence)
- **Perspective**: Patient
- **Mode**: Guided (Scenario: PAT-12345 "Post-Visit Summary")
- **Audience Sees**: Plain language response framing, simplified timeline visibility, and clear "based on" evidence attribution.
- **Audience Must Understand**: How intelligence is presented for transparency and clarity to an individual. The language is deterministic and observational.
- **Explicitly NOT Happening**: No clinical advice is generated; no scheduling "triggers" are executed; no data is written.

### Step 3: Clinician Review (Readiness + Confirmation Preview)
- **Perspective**: Clinician
- **Mode**: Guided (Scenario: PAT-12345 "Referral Coordination")
- **Audience Sees**: Concise clinical synthesis, Action Readiness status (e.g., "Ready for Review"), and a Human Confirmation Preview modal.
- **Audience Must Understand**: The system provides decision support only. It prepares a proposal for human review but cannot execute it. The "Preview" allows inspection of the intent before acknowledgment.
- **Explicitly NOT Happening**: No actual referral is sent; no EHR modification occurs; no automation is active.

### Step 4: Operator Inspection (Audit + Policy + Trust Ledger)
- **Perspective**: Operator
- **Mode**: Free Exploration (Scenario: PAT-12345)
- **Audience Sees**: Detailed Audit Trails (human-readable), Policy Citations, Execution Plan previews, and the Demo Trust Ledger.
- **Audience Must Understand**: Full system accountability. Every synthesis and proposal is traceable to specific evidence, policy, and intent classification.
- **Explicitly NOT Happening**: No live logs; no real-time telemetry; no administrative authority over production systems.

## 3. Demo Lock Rules
- **Behavioral Freeze**: Phase R demo behavior is fixed. No panel order, wording, or framing logic should be altered.
- **Scenario Lock**: No additional scenarios or data fixtures should be demonstrated beyond the governed set.
- **Execution Boundary**: No execution should be promised or discussed as "active" or "imminent". All language must remain conditional and observational.
- **Prohibited Discourse**: No "what if" execution discussions or future capability promises may be made during the canonical walkthrough.

## 4. Execution Boundary Statement
This environment is a **non-executing reference surface**. 
- It **would** present intelligence if connected to a reasoning layer.
- It **could** show intent if provided with data.
- It **might** propose actions if readiness criteria were met.
- It **does NOT** execute, **does NOT** automate, and **does NOT** persist data.

---
*Last Governed Revision: 2026-01-14*
*Governance Status: FROZEN*
