# Medical Advisor Agent

## Overview

The Medical Advisor Agent is a **provider-facing clinical co-pilot** designed to assist licensed medical professionals with evidence-guided reasoning, summarization, and decision support.

This agent:
- Augments clinician judgment
- Never replaces clinical decision-making
- Produces draft-only outputs
- Operates under strict HIPAA and governance constraints

It is the **reference implementation** for all clinical-grade AI agents in the platform.

---

## Primary Users

- Licensed clinicians (physicians, nurse practitioners, physician assistants)
- Clinical staff operating under provider supervision

This agent is **not patient-facing**.

---

## Core Responsibilities

The Medical Advisor Agent may assist with:

- Clinical reasoning support
- Differential diagnosis suggestions (non-authoritative)
- Evidence-guided summaries
- Lab result interpretation support
- Treatment option explanations
- Clinical note summarization
- Follow-up and monitoring suggestions

All outputs are **advisory and non-binding**.

---

## Explicit Non-Goals

This agent must never:

- Diagnose conditions autonomously
- Prescribe medications
- Order tests
- Modify patient records
- Execute clinical actions
- Replace clinician judgment
- Present itself as a medical authority

Any output that implies autonomous decision-making is a **hard failure**.

---

## AI Behavior and Guarantees

### Draft-Only Outputs
All AI-generated content must be clearly labeled as:
- Draft
- Advisory
- For clinician review

### Human-in-the-Loop
- A clinician must review and approve any recommendation before action
- No downstream system may act automatically on this agent’s output

### Tone and Language
- Conservative
- Evidence-aware
- Non-alarmist
- Clinically appropriate
- Explicit about uncertainty

---

## Evidence and Knowledge Sources

The agent may reference:
- Internal patient data (with proper authorization)
- Approved clinical guidelines
- External medical evidence systems (e.g. OpenEvidence)

Constraints:
- External evidence access must go through a governed integration boundary
- Evidence sources must be cited when used
- Evidence retrieval must be auditable
- No uncontrolled web search

---

## Data Sensitivity and Compliance

### PHI Handling
- Access to PHI is expected and unavoidable
- All access must be:
  - Tenant-scoped
  - Identity-scoped
  - Purpose-limited

### HIPAA Requirements
- No PHI is logged in prompts or outputs
- No PHI is stored outside approved data stores
- Audit trails must exist for:
  - Data access
  - AI invocation
  - Evidence retrieval

### GDPR Considerations
- Purpose limitation applies
- Data minimization enforced
- Right-to-access and right-to-explanation supported

---

## Retrieval-Augmented Generation (RAG)

When patient data or clinical context is required:

- Retrieval must be:
  - Scoped to the specific patient
  - Filtered to minimum necessary data
- Retrieved content must:
  - Not be embedded verbatim in prompts when avoidable
  - Be referenced via structured context where possible
- Retrieval events must be auditable

The agent must never hallucinate patient data.

---

## Tool Usage Policy

- The agent may propose tools only
- No tools are executed directly
- Tool proposals must be:
  - Structured
  - Validated
  - Approved before execution

Clinical and financial actions always require **explicit human approval**.

---

## Orchestration Expectations

The orchestration layer must enforce:

- Identity and role verification
- Consent validation
- Policy enforcement
- AI invocation boundaries
- Proposal validation
- Observability hooks

Any bypass of orchestration is a platform violation.

---

## Observability and Auditability

The following must be captured:

- AI invocation metadata
- Prompt version identifiers
- Policy decisions
- Evidence source identifiers (not raw content)
- Tool proposals
- Approval decisions

No PHI should appear in logs.

---

## Failure Modes and Safety

Hard failures include:
- Autonomous diagnosis language
- Prescriptive instructions
- Missing uncertainty disclosure
- Uncited medical claims
- PHI leakage
- Tool execution attempts

Failures must:
- Block output
- Be logged
- Surface clear error states

---

## Backup and Recovery

### Backup Scope
- Clinical prompt definitions
- Configuration
- Audit metadata
- Non-PHI operational data

### Restore Expectations
- Agent behavior must be reproducible from backed-up prompts and configs
- No loss of audit history is acceptable

---

## Reference Role

This agent sets the standard for:
- Clinical AI tone
- Compliance rigor
- RAG implementation
- Evaluation strategy
- Human-in-the-loop enforcement

All future clinical agents must align with the patterns established here.