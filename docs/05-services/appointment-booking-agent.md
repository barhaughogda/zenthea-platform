# Appointment Booking Agent

## Overview

The Appointment Booking Agent assists patients and providers with **scheduling, rescheduling, and cancelling appointments** in a safe, auditable, and compliant manner.

This agent:
- Proposes scheduling actions
- Never executes side effects directly
- Operates under strict consent, identity, and policy constraints
- Acts as the canonical reference for tool-driven workflows

It is the platform’s primary example of **AI-assisted orchestration with real-world effects**.

---

## Primary Users

- Patients
- Providers
- Clinical staff (e.g. reception, care coordinators)

This agent may be accessed via patient-facing or staff-facing applications.

---

## Core Responsibilities

The Appointment Booking Agent may assist with:

- Finding available appointment slots
- Proposing new appointments
- Proposing reschedules or cancellations
- Explaining scheduling constraints or conflicts
- Coordinating between patient preferences and provider availability
- Generating structured booking proposals

All actions are **proposals only** until approved and executed by the platform.

---

## Explicit Non-Goals

This agent must never:

- Directly book, modify, or cancel appointments
- Bypass approval or consent checks
- Execute external scheduling tools
- Make clinical decisions
- Override provider availability rules
- Send notifications autonomously

All side effects must go through orchestration and the Tool Execution Gateway.

---

## Consent and Authorization

- All patient-related actions must be validated via the Consent Agent
- The agent must verify:
  - Patient identity
  - Provider or staff role
  - Purpose of action
- Revoked consent must immediately block proposals

The agent must fail closed if authorization cannot be verified.

---

## AI Behavior and Constraints

### Proposal-Only Output
- AI outputs must be structured proposals
- No implicit execution
- No hidden side effects

### Language
- Clear and neutral
- No promises of confirmed bookings
- Explicitly states when actions are pending approval

---

## Tool Proposal Model

The agent must output proposals compatible with the Tool Proposal Model, including:

- Proposed action (create, reschedule, cancel)
- Target system (e.g. scheduling system)
- Required parameters
- Idempotency keys
- Approval requirements
- Audit metadata

No raw tool calls are permitted.

---

## Orchestration Expectations

The orchestration layer must enforce:

- Identity verification
- Consent validation
- Policy checks
- Conflict detection
- Proposal validation
- Approval workflow
- Submission to the Tool Execution Gateway
- Audit logging

Bypassing orchestration is a platform violation.

---

## Tool Execution Gateway Integration

- All approved proposals must be executed via the Tool Execution Gateway
- The gateway is responsible for:
  - Idempotency
  - Vendor isolation
  - Observability
  - Error handling
- The agent never calls external systems directly

---

## HIPAA Compliance

The Appointment Booking Agent enforces:

- Minimum necessary data usage
- Purpose limitation
- Access logging
- Safeguards against improper disclosure

Scheduling metadata is treated as sensitive and must be protected accordingly.

---

## GDPR Compliance

The agent supports GDPR obligations including:

- Lawful basis validation
- Consent enforcement
- Data minimization
- Right to access and explanation

Jurisdiction-aware behavior must be enforced via policy.

---

## Observability and Auditability

The following must be captured:

- Identity context
- Consent decisions
- Proposed actions
- Approval outcomes
- Tool execution metadata
- Failures and retries

Logs must be immutable and auditable.

---

## Backup and Recovery

### Backup Scope
- Proposal records
- Configuration
- Policy metadata
- Audit logs

### Restore Expectations
- No loss of booking intent history is acceptable
- Idempotency guarantees must be preserved

---

## Reference Role

This agent defines:
- How AI proposes real-world actions safely
- How approvals and execution are separated
- How tool gateways are used correctly
- How auditability is preserved for side effects

All future workflow and orchestration agents must follow the patterns established here.