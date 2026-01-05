# Consent Agent

## Overview

The Consent Agent is the **authoritative system of record for consent, authorization, and data-sharing permissions** across the Zenthea Platform.

It governs:
- Who may access what data
- For what purpose
- For how long
- Under which legal and regulatory constraints

All agents and services that access PHI or PII must operate **within the decisions enforced by this agent**.

---

## Primary Users

- Patients
- Clinicians
- Compliance officers
- Platform administrators

This agent is not UI-facing by default, but its decisions are surfaced through other agents and applications.

---

## Core Responsibilities

The Consent Agent is responsible for:

- Managing patient consent records
- Enforcing purpose-based access control
- Handling consent revocation and expiration
- Supporting HIPAA authorization flows
- Supporting GDPR consent and lawful basis tracking
- Providing explainable consent decisions to other services
- Producing auditable consent decision logs

This agent is **deterministic-first**, with AI used only to assist explanation and workflow.

---

## Explicit Non-Goals

The Consent Agent must never:

- Generate medical advice
- Interpret clinical data
- Execute external actions
- Override legal or regulatory requirements
- Infer consent implicitly without explicit rules
- Allow AI to autonomously grant or revoke consent

Consent enforcement is not probabilistic.

---

## Consent Model

### Consent Types
The agent must support, at minimum:

- Treatment
- Payment
- Healthcare operations
- Research (where applicable)
- Data sharing with third parties
- AI-assisted processing

Each consent record must include:
- Subject (patient)
- Actor (who requested access)
- Purpose
- Scope (data categories)
- Duration
- Jurisdiction
- Revocation status

---

## AI Behavior and Constraints

### AI Usage (Limited)
AI may be used to:
- Explain consent implications in plain language
- Assist users in understanding options
- Generate summaries of consent history
- Help staff resolve consent-related workflows

AI must not:
- Make consent decisions
- Grant access
- Revoke consent
- Modify consent records

All enforcement is deterministic.

---

## HIPAA Compliance

The Consent Agent enforces HIPAA requirements including:

- Minimum necessary access
- Purpose limitation
- Accounting of disclosures
- Authorization tracking
- Revocation enforcement

Consent decisions must be:
- Traceable
- Explainable
- Auditable

---

## GDPR Compliance

The Consent Agent supports GDPR obligations including:

- Lawful basis tracking
- Explicit consent capture
- Right to withdraw consent
- Right to access
- Right to explanation
- Purpose limitation

Jurisdiction-specific behavior must be enforced via policy.

---

## Interaction with Other Agents

The Consent Agent is consulted by:

- medical-advisor-agent
- patient-portal-agent
- clinical-documentation-agent
- care-plan-agent
- audit-agent
- ai-governor-agent

No agent may bypass consent checks.

---

## API Expectations

The Consent Agent must expose APIs to:

- Query consent status
- Validate access requests
- Record consent grants
- Record consent revocations
- Retrieve consent history
- Explain consent decisions

All responses must be structured and deterministic.

---

## Orchestration Expectations

The orchestration layer must enforce:

- Identity verification
- Role verification
- Jurisdiction resolution
- Policy evaluation
- Deterministic decision paths
- Audit logging

AI is never in the enforcement path.

---

## Data Sensitivity and Security

- Consent records are sensitive but not PHI themselves
- They must be encrypted at rest
- Access must be strictly controlled
- All reads and writes must be audited

No consent data may be logged in plaintext.

---

## Observability and Auditability

The following must be captured:

- Consent grants
- Consent revocations
- Consent checks
- Access denials
- Jurisdiction applied
- Purpose asserted
- Policy version used

Logs must be immutable and queryable for audits.

---

## Tool Usage Policy

- The Consent Agent does not execute tools
- It does not call external systems directly
- Any downstream actions triggered by consent changes must go through:
  - Orchestration
  - Approval (if required)
  - Tool Execution Gateway

---

## Backup and Recovery

### Backup Scope
- Consent records
- Policy definitions
- Jurisdiction mappings
- Audit metadata

### Restore Expectations
- Consent state must be fully restorable
- No loss of revocation history is acceptable
- Policy versioning must be preserved

---

## Reference Role

The Consent Agent is the **compliance backbone** of the platform.

Its patterns define:
- How access is gated
- How legality is enforced
- How AI is safely constrained
- How audits are performed

If consent is wrong, everything is wrong.