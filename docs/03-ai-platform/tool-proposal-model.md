## Tool Proposal Model

## Purpose

This document defines the **Tool Proposal Model** used by AI agents in the platform.

It explains:
- How AI agents propose tool usage
- The boundary between AI intent and system execution
- The structure of a tool proposal
- Approval and risk classification rules
- How compliance requirements are enforced
- How this model integrates with external orchestration tools (for example n8n)

This document answers the question:
**“How can AI safely interact with real-world tools without executing them directly?”**

---

## Core Principle

**AI agents never execute tools.**

AI agents may:
- Propose tool actions declaratively
- Explain intent and reasoning
- Provide structured parameters

The system:
- Validates proposals
- Enforces policy and compliance
- Requires approval when necessary
- Executes tools through controlled infrastructure

This separation is non-negotiable.

---

## Tool Proposal vs Tool Execution

### Tool Proposal

A **tool proposal** is:
- A structured declaration of intent
- Side-effect free
- Reversible by design
- Fully auditable

A proposal does **not**:
- Perform actions
- Trigger side effects
- Assume success
- Chain executions

### Tool Execution

Tool execution:
- Occurs only after validation and approval
- Is performed by infrastructure code
- May be delegated to orchestration systems (for example n8n)
- Is fully observable and auditable

Execution is a system responsibility, not an AI capability.

---

## Canonical Tool Proposal Schema

Tool proposals must conform to the following schema.

This schema is **language-agnostic** and **transport-agnostic**.

```json
{
  "proposal_id": "uuid",
  "proposed_by": "ai-agent-name",
  "timestamp": "ISO-8601",
  "domain": "chat | sales | accounting | marketing | project-management",
  "tool": {
    "name": "string",
    "version": "string"
  },
  "intent": {
    "summary": "string",
    "reasoning": "string"
  },
  "parameters": {
    "key": "value"
  },
  "risk_level": "low | medium | high",
  "approval_required": true,
  "compliance_context": {
    "gdpr": false,
    "hipaa": false
  },
  "idempotency_key": "string",
  "rollback_supported": true
}
```

---

## Field Semantics

### `proposal_id`

- **Meaning**: Globally unique identifier
- **Used for**: Tracing, approval, execution, and audit

### `proposed_by`

- **Meaning**: Identifier of the AI agent or service proposing the action
- **Used for**: Attribution and observability

### `timestamp`

- **Meaning**: Time of proposal creation
- **Used for**: Audit trails and expiration handling

### `domain`

- **Meaning**: Domain context of the proposal
- **Constraints**:
  - Must match the proposing service’s domain
  - Used for policy and ownership enforcement

### `tool`

Defines the target tool.

- **Fields**:
  - `name`: Fully qualified tool action name
  - `version`: Tool version or API revision
- **Example**: `google_calendar.create_event`

### `intent`

Human-readable explanation of the proposal.

- **Fields**:
  - `summary`: One-line description of the action
  - `reasoning`: Why this action is appropriate

Intent is critical for human approval and audits.

### `parameters`

Structured parameters required to perform the action.

- **Rules**:
  - Must be explicit
  - Must be complete
  - Must avoid implicit defaults
  - Must not include unnecessary data

### `risk_level`

Declared risk level of the action.

- **Values**:
  - `low`
  - `medium`
  - `high`

Risk classification is validated by the system and may be overridden.

### `approval_required`

Boolean flag indicating whether human approval is required.

- **Rules**:
  - Defaults to `true`
  - May only be `false` for explicitly allowlisted actions
  - Must align with `risk_level` and `compliance_context`

### `compliance_context`

Indicates which regulatory regimes apply.

- **Fields**:
  - `gdpr`
  - `hipaa`
- **Used to**:
  - Enforce stricter validation
  - Apply redaction rules
  - Require approval where necessary

### `idempotency_key`

Used to prevent duplicate execution.

- **Rules**:
  - Required for all proposals
  - Must uniquely represent the action intent
  - Enables safe retries

### `rollback_supported`

Indicates whether the action supports rollback.

- **Rules**:
  - `true` does not guarantee rollback success
  - `false` implies higher risk
  - Used in approval UX and risk assessment

---

## Approval Model

### Definition

Approval required means:

A human must explicitly confirm the proposed action after full specification and before execution.

Approval is:
- Per proposal
- Explicit
- Logged
- Non-transferable

### Approval Is Required When

Approval is mandatory if any of the following apply:
- External side effects
- Third-party impact
- Persistent data modification
- Personal or regulated data involvement
- Financial or legal implications
- Irreversible or hard-to-reverse actions
- Cross-system or cross-domain impact

When in doubt, approval is required.

### Approval UX Requirements (Conceptual)

Approval interfaces must show:
- Action summary
- Target system
- Affected data
- Rollback support
- Failure implications

Approval must be:
- Clear
- Unambiguous
- Easy to reject

---

## Auto-Execution Rules

### Auto-Execution Is the Exception

Actions may be auto-executed only if all conditions are met:
- No external side effects
- No personal or regulated data
- Fully reversible
- Idempotent
- Explicitly allowlisted
- Low risk of harm

Auto-execution must be:
- Explicitly configured
- Observable
- Revocable

---

## Tool Action Categories

### Category A: Auto-Executable (Strictly Limited)

Examples:
- Internal read-only queries
- Validation checks
- Draft generation
- Preview computation
- Dry-run simulations

### Category B: Conditionally Auto-Executable (Future)

Examples:
- Internal task updates
- Internal scheduling
- Metadata synchronization

Requires:
- Explicit user opt-in
- Strict allowlists
- Full audit logging

Not implemented initially.

### Category C: Always Human-Approved

Examples:
- Google Calendar events
- Email sending
- CRM updates
- Accounting actions
- Payments
- Data deletion
- External notifications

Default category for all new tools.

---

## Compliance Enforcement

### GDPR Mode

In GDPR mode:
- Personal data must be minimized
- Purpose limitation is enforced
- Proposals must support data erasure workflows
- Memory and logging are restricted
- Approval is required for personal data actions

### HIPAA Mode

In HIPAA mode:
- PHI handling is tightly restricted
- Approved tools only
- Explicit approval for all PHI-related actions
- Enhanced audit logging

Compliance rules override AI intent.

---

## Observability and Audit

Every tool proposal must be logged with:
- Proposal ID
- Prompt version and hash
- Model and provider
- Risk classification
- Approval decision
- Execution outcome

Audit logs are immutable.

---

## Integration with Orchestration Systems

External systems (for example n8n):
- Never receive raw AI output
- Receive validated, approved execution commands
- Operate with scoped credentials
- Emit execution results back to the platform

n8n is an executor, not a decision-maker.

---

## Failure Handling

Failures must:
- Be explicit
- Be observable
- Not trigger retries automatically unless safe
- Not cascade into additional actions

AI agents may propose remediation, not execute it.

---

## Anti-Patterns (Explicitly Disallowed)

The following are prohibited:
- AI executing tools directly
- Implicit tool execution
- Chained tool execution proposals
- Tool proposals that initiate or modify financial transactions
- Tool execution hidden in prompts
- Silent retries of side-effecting actions

Violations are defects.

---

## Summary

The Tool Proposal Model ensures:
- AI can interact with real systems safely
- Humans remain in control of side effects
- Compliance is enforceable by design
- Automation is scalable and auditable

AI proposes.  
The system decides.  
Infrastructure executes.

---

## What to do now

1. Review/update this doc in-place: `Docs/03-ai-platform/tool-proposal-model.md`
2. Commit the changes