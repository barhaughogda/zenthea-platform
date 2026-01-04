# ADR-004: Prompt Governance

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is AI-first and relies heavily on prompts to:
- Guide AI behavior across services
- Enforce safety, compliance, and policy constraints
- Produce structured, explainable outputs
- Coordinate AI-driven workflows

Without governance, prompts tend to:
- Accumulate hidden logic
- Drift across services
- Bypass domain rules
- Introduce silent regressions
- Become untestable and unreviewable

Prompt changes can materially alter system behavior without code changes.  
A formal governance model is required to ensure safety, predictability, and long-term maintainability.

---

## Decision

We adopt **formal prompt governance** as a first-class architectural constraint.

This means:
- Prompts are treated as versioned system artifacts
- Prompts follow a strict layered architecture
- Prompt changes follow a defined lifecycle
- Prompt behavior is tested and evaluated
- Prompt rollout and rollback are controlled
- Prompt execution is observable and auditable

Ad-hoc or inline prompt usage is explicitly disallowed.

---

## Rationale

This decision was made for the following reasons:

---

### 1. Prompts Are Executable Behavior

Prompts directly influence:
- AI reasoning
- Tool usage
- System outputs
- User-facing behavior

Treating prompts as informal strings creates hidden execution paths.

Governance makes prompt behavior explicit.

---

### 2. Safety and Compliance Requirements

In regulated and safety-sensitive environments:
- Prompts must enforce refusal behavior
- Prompts must avoid sensitive data leakage
- Prompts must respect policy constraints
- Prompt behavior must be auditable

Governance ensures prompts cannot silently violate constraints.

---

### 3. Predictability and Stability

Small prompt changes can cause large behavior shifts.

Governance enables:
- Controlled iteration
- Regression detection
- Fast rollback
- Confidence in production behavior

This is essential for trust in AI systems.

---

### 4. AI Tooling and Automation

AI agents will:
- Read prompts
- Propose prompt changes
- Generate prompt drafts

Without governance, AI agents amplify prompt sprawl.

Governance ensures AI agents operate within safe boundaries.

---

### 5. Long-Term Maintainability

Prompt logic tends to grow over time.

Governance:
- Encourages modular prompts
- Prevents “mega-prompts”
- Keeps responsibilities separated
- Makes prompt intent clear years later

This prevents architectural decay.

---

## Governance Rules

The following rules are mandatory.

---

### Prompt Architecture

All prompts must:
- Follow the layered prompt architecture
- Separate system, policy, domain, task, memory, and input concerns
- Be composed dynamically by the AI runtime

Monolithic prompts are not allowed.

---

### Prompt Storage

- Prompts live in `/docs/09-prompts`
- Prompt templates live in `/docs/09-prompts/prompt-templates`
- Prompts do not live in code
- Prompt files are immutable once versioned

The repository is the system of record.

---

### Prompt Versioning

- Every prompt is versioned
- Prompt changes create new versions
- Old versions remain available until deprecated
- Version selection is configuration-driven

Prompt overwrites are prohibited.

---

### Prompt Lifecycle

All prompts must follow the defined lifecycle:
- Draft
- Review
- Test
- Stage
- Deploy
- Observe
- Iterate
- Deprecate

Skipping lifecycle stages is not allowed.

---

### Prompt Testing and Evaluation

Prompt changes must be covered by:
- Golden tests
- Schema validation
- Safety and refusal tests
- Policy compliance tests
- Regression detection
- Cost and latency evaluation

Failing prompt tests block promotion.

---

### Prompt Rollout and Rollback

- Prompt rollout is configuration-based
- Tenant-scoped rollout is preferred
- Rollback must be immediate
- Rollout and rollback are observable

Prompt changes must be reversible without code changes.

---

### Ownership and Review

Each prompt must have:
- A clear owner
- A documented purpose
- A review history

AI-generated prompts require human approval.

---

## Alternatives Considered

### Alternative 1: Informal Prompt Usage

**Description**
- Prompts embedded in code
- Minimal review or testing

**Why it was rejected**
- Unsafe
- Unobservable
- Impossible to audit
- Causes silent regressions

This approach does not scale.

---

### Alternative 2: Light Guidelines Only

**Description**
- Best practices without enforcement

**Why it was rejected**
- Guidelines are ignored over time
- No protection against drift
- No rollback guarantees

Governance must be enforced, not suggested.

---

## Consequences

### Positive Consequences

- Predictable AI behavior
- Safer production deployments
- Faster debugging and rollback
- Better AI tooling leverage
- Strong compliance posture

---

### Negative Tradeoffs

- Additional process overhead
- Slower initial prompt iteration
- Requires discipline and tooling

These tradeoffs are intentional and justified.

---

## Compliance and Security Impact

- Strong auditability of AI behavior
- Clear enforcement of compliance rules
- Reduced risk of sensitive data leakage
- Easier compliance reviews and audits

Prompt governance materially improves compliance readiness.

---

## AI and Automation Impact

- AI agents operate within strict boundaries
- Prompt changes are explainable and testable
- Automation becomes safer and more predictable

This decision is essential for safe AI automation.

---

## Implementation Notes

- Governance is enforced via:
  - Repository structure
  - CI/CD checks
  - Code review
  - Runtime enforcement
- Violations are treated as defects

Prompt governance is non-negotiable.

---

## Related Documents

- `/docs/09-prompts/prompt-philosophy.md`
- `/docs/09-prompts/prompt-architecture.md`
- `/docs/09-prompts/prompt-lifecycle.md`
- `/docs/09-prompts/prompt-testing-and-evals.md`
- `/docs/09-prompts/prompt-versioning-and-rollout.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR intentionally formalizes prompt engineering as an engineering discipline, not an experiment.