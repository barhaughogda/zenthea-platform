# ADR-007: External Tool Orchestration

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is designed to support AI-driven workflows that may interact with external systems such as:
- Calendars (for example Google Calendar)
- Email providers
- CRM systems
- Accounting and billing tools
- Other third-party SaaS platforms

These integrations introduce:
- Real-world side effects
- Third-party impact
- Compliance obligations (GDPR, HIPAA)
- Security and credential management concerns

A clear architectural decision was required to determine:
- How external tools are invoked
- Who is allowed to trigger them
- How safety, approval, and auditability are enforced
- How vendor-specific tooling (for example n8n) fits into the system

---

## Decision

We adopt a **mediated external tool orchestration model**.

This means:
- AI agents never execute external tools directly
- AI agents only produce **tool proposals**
- All external tool execution is performed by controlled orchestration infrastructure
- Orchestration systems are downstream executors, not decision-makers
- Approval, validation, and compliance enforcement occur before execution

External orchestration is an implementation detail, not a core dependency.

---

## Rationale

### 1. Separation of Intent and Side Effects

AI is excellent at reasoning about intent, but unsafe at executing side effects.

By separating:
- **Intent** (AI proposal)
- **Decision** (system validation and approval)
- **Execution** (orchestration infrastructure)

We prevent accidental or malicious actions while retaining AI leverage.

---

### 2. Compliance and Audit Requirements

Regulated environments require:
- Explicit approval flows
- Clear audit trails
- Deterministic execution paths
- Controlled credential usage

A mediated orchestration layer ensures:
- Compliance rules are enforced consistently
- Execution is fully auditable
- Sensitive credentials are never exposed to AI

---

### 3. Vendor Independence

External orchestration tools evolve quickly.

By treating orchestration as a replaceable layer:
- We avoid vendor lock-in
- We can swap tools without architectural change
- We can support multiple executors in parallel

The architecture does not depend on any single vendor.

---

### 4. Operational Safety

Direct execution from AI or backend services:
- Increases blast radius
- Makes rollback difficult
- Obscures responsibility

Centralized orchestration allows:
- Rate limiting
- Retries with control
- Failure isolation
- Clear ownership

---

## Orchestration Boundary and Execution Gateway

External orchestration systems (for example n8n) are treated as **execution-only infrastructure**.

They are explicitly outside the core system boundary.

### Non-Negotiable Boundary

- Orchestration systems never receive AI output directly
- Orchestration systems never interpret intent
- Orchestration systems never apply business or domain logic
- Orchestration systems never enforce compliance rules
- Orchestration systems never make decisions

They execute approved commands only.

---

### Execution Gateway

All interaction with orchestration systems occurs through a **system-owned Execution Gateway**.

The Execution Gateway is responsible for:
- Receiving approved tool execution commands
- Validating commands defensively
- Translating commands into orchestration-specific payloads
- Handling authentication and tenant scoping
- Correlating execution results
- Emitting audit and observability events

Orchestration systems never communicate directly with:
- AI agents
- Backend services
- Frontend applications

---

### Execution Command Contract

Orchestration systems receive **execution commands**, not tool proposals.

Execution commands:
- Are fully validated
- Contain no AI reasoning
- Are explicit and deterministic
- Include idempotency and correlation identifiers
- Represent approved actions only

Any orchestration request lacking explicit approval context is rejected.

---

### Failure and Retry Rules

- Orchestration systems may retry technical failures only
- Business logic retries are prohibited
- Conditional or branching logic is not allowed in orchestration workflows
- Failures are reported back to the system verbatim

If remediation is required, a new tool proposal must be created.

---

### Security and Credentials

- All third-party credentials are owned by the orchestration layer
- Credentials are scoped per tenant and per tool
- Credentials are never exposed to AI agents or services
- Credential rotation is centralized and auditable

This boundary is enforced by architecture, not convention.

---

### Explicit Non-Goals

The orchestration layer is not responsible for:
- Understanding user intent
- Coordinating multi-domain workflows
- Enforcing compliance rules
- Applying business validation
- Managing AI behavior

Violations of this boundary are considered architectural defects.

---

## Approved Orchestration Pattern

The canonical flow is:

1. AI agent produces a tool proposal
2. AI runtime validates proposal structure and policy
3. Risk and compliance checks are applied
4. Human approval is requested if required
5. An execution command is issued to orchestration infrastructure
6. Orchestration executes the action
7. Results are reported back and logged

At no point does AI execute tools directly.

---

## Role of Orchestration Systems (for example n8n)

Orchestration systems:
- Execute approved actions
- Integrate with third-party APIs
- Handle retries and technical failures
- Emit execution results

Orchestration systems do NOT:
- Interpret user intent
- Decide whether actions are allowed
- Apply business or domain rules
- Bypass approval requirements

They are executors, not brains.

---

## Tool Classification Enforcement

External tool actions are classified according to the Tool Proposal Model:

- Auto-executable actions (rare and explicitly allowlisted)
- Conditionally auto-executable actions (future)
- Always human-approved actions (default)

Orchestration systems may only execute actions explicitly marked as approved.

---

## Credential and Security Model

- Credentials are owned by the orchestration layer
- Credentials are scoped per tool and per tenant
- AI agents never access credentials
- Services never embed third-party secrets
- Credential rotation is centralized

This significantly reduces security risk.

---

## Failure and Recovery Model

Execution failures:
- Are explicit and observable
- Do not trigger automatic cascading actions
- May produce new tool proposals for remediation
- Are logged with full context

AI may suggest remediation.  
The system decides whether to act.

---

## Alternatives Considered

### Alternative 1: Direct AI Tool Execution

**Description**
- AI agents directly call third-party APIs

**Why it was rejected**
- Unsafe
- Non-compliant
- Un-auditable
- High blast radius

This approach is unacceptable.

---

### Alternative 2: Direct Service-to-Tool Integration

**Description**
- Backend services directly integrate with third-party tools

**Why it was rejected**
- Duplicated integrations
- Credential sprawl
- Inconsistent approval handling
- Harder to audit and evolve

This creates hidden coupling and risk.

---

## Consequences

### Positive Consequences

- Strong safety guarantees
- Clear audit trails
- Vendor independence
- Easier compliance reviews
- Scalable automation

---

### Negative Tradeoffs

- Additional architectural layer
- Slightly higher initial complexity
- Requires disciplined execution model

These tradeoffs are intentional and acceptable.

---

## Compliance and Security Impact

This decision:
- Strengthens GDPR and HIPAA compliance
- Prevents credential leakage
- Enables deterministic audits
- Reduces operational risk

External integrations become safe by default.

---

## AI and Automation Impact

- AI remains powerful but constrained
- Automation is predictable and explainable
- Trust boundaries are explicit

This ADR is essential for responsible AI-driven automation.

---

## Implementation Notes

- Orchestration integration is deferred until needed
- Initial implementation may use n8n
- Alternative executors may be added later
- Violations of this model are treated as defects

Execution is centralized. Authority is not.

---

## Related Documents

- `/docs/05-ai/tool-proposal-model.md`
- `/docs/10-decisions/adr-003-ai-runtime-abstraction.md`
- `/docs/09-prompts/prompt-writing-guidelines.md`
- `/docs/10-decisions/adr-006-compliance-by-design.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR deliberately constrains AI power to preserve safety, trust, and long-term scalability.