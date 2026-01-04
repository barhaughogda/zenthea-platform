# Medical Advisor Agent

## Overview

The Medical Advisor Agent is a **provider-facing clinical co-pilot** designed to assist licensed medical professionals with evidence-guided reasoning, summarization, and decision support.

This agent:
- Augments clinician judgment
- Never replaces clinical decision-making
- Produces draft-only outputs
- Operates under strict HIPAA and governance constraints

It is the **reference implementation** for all clinical-grade AI agents in the platform.

**Status: DRAFT / ADVISORY**

---

## Primary Users

- Licensed clinicians (physicians, nurse practitioners, physician assistants)
- Clinical staff operating under provider supervision

This agent is **not patient-facing**.

---

## Responsibilities

The Medical Advisor Agent may assist with:
- Clinical reasoning support
- Differential diagnosis suggestions (non-authoritative)
- Evidence-guided summaries
- Lab result interpretation support
- Treatment option explanations
- Clinical note summarization
- Follow-up and monitoring suggestions

---

## Non-Goals

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

## API Surface

The API provides endpoints for clinical queries and reasoning support.
- `ClinicalQueryRequest`: Input for clinical questions or reasoning tasks.
- `ClinicalQueryResponse`: Draft-only, advisory output.

---

## AI Capabilities and Limits

- **Capabilities**: Evidence retrieval, clinical summarization, reasoning support.
- **Limits**: No autonomous decisions, requires human review, bounded by governed evidence sources.
- **Draft-Only**: All AI-generated content is clearly labeled as advisory.

---

## Compliance Notes (HIPAA + GDPR)

- **HIPAA**: All PHI access is tenant-scoped, identity-scoped, and purpose-limited. No PHI is logged.
- **GDPR**: Enforces purpose limitation and data minimization. Supports right-to-explanation.
- **Auditability**: All AI invocations and data access are auditable.

---

## Tool Usage Policy

- The agent may propose tools only.
- No tools are executed directly by this agent.
- All clinical and financial actions require explicit human approval.

---

## Observability

Captures metadata for:
- AI invocations
- Prompt versions
- Policy decisions
- Evidence source identifiers

---

## Backup and Recovery

- **Backup Scope**: Clinical prompt definitions, configuration, audit metadata, non-PHI operational data.
- **Backup Frequency**: Baseline frequency (e.g., Daily for Production).
- **Restore Procedure**: Agent behavior must be reproducible from backed-up prompts and configs. No loss of audit history is acceptable.

---

## Advisory Notice
This agent does not make autonomous decisions. All outputs are for clinician review only.
