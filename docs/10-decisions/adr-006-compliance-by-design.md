# ADR-006: Compliance by Design

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is intended to operate across:
- Multiple industries
- Multiple clients
- Regulated and non-regulated environments
- AI-driven workflows that may handle sensitive data

Some clients and use cases require compliance with strict regulatory frameworks (for example HIPAA).

The platform must also support compliance with data protection regulations such as GDPR for EU-based users and clients.

This introduces additional requirements around:
- Lawful data processing
- Data minimization
- Right to access and erasure
- Data portability
- Purpose limitation

Historically, compliance is often treated as:
- An afterthought
- A deployment-time concern
- A set of manual procedures
- A “special mode” bolted on late

This approach does not scale, especially in AI-first systems where behavior can change without code changes.

A foundational decision was required:  
**Should compliance be layered on top of the system, or built into its core architecture?**

---

## Decision

We adopt **compliance by design** as a core architectural principle.

This means:
- Compliance requirements are encoded into architecture
- Compliance constraints are enforced by default
- Compliance behavior is configuration-driven, not ad hoc
- Compliance affects AI, data, logging, vendors, and UX
- Non-compliant behavior is structurally difficult or impossible

Compliance is not optional and not retrofitted.

---

## Rationale

### 1. AI Systems Require Strong Guardrails

AI systems can:
- Generalize beyond intended scope
- Produce unexpected outputs
- Interact with sensitive data in non-obvious ways

Compliance by design ensures:
- AI behavior is constrained
- Prompt governance enforces refusal and redaction
- Tool usage is policy-gated
- Outputs are validated before use

AI without compliance guardrails is unsafe.

---

### 2. Configuration Is Safer Than Custom Code

Compliance requirements vary by:
- Client
- Industry
- Jurisdiction

Encoding compliance in configuration allows:
- Tenant-scoped enforcement
- Fast rollout and rollback
- Auditable changes
- Reduced need for forks or custom logic

Hardcoding compliance logic leads to divergence and bugs.

---

### 3. Consistency Across the System

Compliance must be enforced consistently across:
- Backend services
- AI runtime
- Prompt behavior
- Frontend UX
- Logging and observability
- CI/CD and deployment

Design-time enforcement ensures no layer becomes a weak link.

---

### 4. Auditability and Trust

Regulated environments require:
- Clear audit trails
- Deterministic behavior
- Explainable decisions
- Provable controls

Compliance by design produces systems that are:
- Easier to audit
- Easier to reason about
- Easier to trust

This reduces operational and legal risk.

---

### 5. Long-Term Scalability

Treating compliance as foundational:
- Avoids expensive rewrites
- Prevents “compliance debt”
- Enables onboarding of regulated clients without re-architecture

This is a strategic investment, not overhead.

---

## What Compliance by Design Enforces

Compliance affects the following areas by default:

---

### Architecture

- Service-per-domain boundaries
- Explicit data ownership
- No shared databases
- Clear responsibility separation

---

### Configuration

- Explicit compliance mode flags
- Tenant-scoped compliance configuration
- Approved vendor allowlists
- Feature gating

Compliance behavior is driven by configuration, not code branches.

---

### AI Runtime

- Approved model providers only
- Prompt redaction rules
- Policy-enforced refusals
- Tool permission enforcement
- Full AI observability

AI behavior cannot bypass compliance constraints.

---

### Prompt Governance

- Mandatory policy prompt layers
- Explicit refusal behavior
- Prompt testing for compliance
- Auditable prompt versions

Prompts cannot silently violate compliance rules.

---

### Data Handling

- Explicit data classification
- Encryption at rest and in transit
- Strict access controls
- Defined retention and deletion policies

Sensitive data handling is explicit and enforced.

---

### Frontend UX

- Role-based access
- Explicit approvals for sensitive actions
- Redaction in UI where required
- No sensitive logic in client code

UX is part of the compliance surface.

---

### Observability and Logging

- Audit logs for sensitive actions
- Controlled logging of sensitive fields
- Correlation IDs for traceability
- Retention policies aligned with regulation

Logs support audits without creating leaks.

---

### Backup, Retention, and Recovery

Compliance by design includes explicit backup, retention, and recovery strategies that respect regulatory requirements such as GDPR and HIPAA.

---

### GDPR-Specific Enforcement

When operating in GDPR compliance mode, the system enforces:

- Explicit data classification (personal vs non-personal)
- Purpose limitation for data processing
- Data minimization by default
- Configurable data retention policies
- Support for data access, export, and erasure
- Restricted AI memory usage involving personal data
- Explicit user consent handling where required

GDPR compliance is enforced structurally, not procedurally.

---

## Alternatives Considered

### Alternative 1: Compliance as a Deployment Concern

**Description**
- Base system is non-compliant
- Compliance added via environment setup and procedures

**Why it was rejected**
- Too easy to misconfigure
- Hard to audit
- Unsafe for AI-driven behavior
- Does not scale across clients

This approach creates hidden risk.

---

### Alternative 2: Separate “Compliant” Code Paths

**Description**
- Forked logic for regulated clients

**Why it was rejected**
- Leads to divergence
- High maintenance cost
- Inconsistent behavior
- Increased bug surface

Forking is not a sustainable compliance strategy.

---

## Consequences

### Positive Consequences

- Strong default safety posture
- Easier audits and reviews
- Faster onboarding of regulated clients
- Reduced long-term risk
- Higher trust with clients and partners

---

### Negative Tradeoffs

- Increased upfront design complexity
- Additional configuration and testing requirements
- More discipline required during development

These tradeoffs are intentional and justified.

---

## Compliance and Security Impact

This ADR strengthens compliance with multiple regulatory regimes, including but not limited to HIPAA and GDPR:
- Security posture
- Data protection
- Audit readiness
- Regulatory compliance

Compliance is enforceable, not aspirational.

---

## AI and Automation Impact

- AI behavior is constrained by policy
- Automation respects regulatory limits
- Prompt and tool governance enforce safe behavior

This decision is essential for safe AI automation in regulated domains.

---

## Implementation Notes

- Compliance mode is explicit and tenant-scoped
- Violations are blocked by architecture and runtime
- Compliance behavior is tested continuously
- Deviations require an ADR

Compliance shortcuts are not allowed.

---

## Related Documents

- `/docs/07-devops/environments-and-config.md`
- `/docs/07-devops/observability.md`
- `/docs/09-prompts/prompt-governance.md`
- `/docs/08-build-guidelines/ai-integration-guide.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR deliberately treats compliance as a structural property of the system, not a feature.