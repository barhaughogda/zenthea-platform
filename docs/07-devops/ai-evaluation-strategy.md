# AI Evaluation Strategy

## Purpose

This document defines the **AI evaluation strategy** for the platform.

It explains:
- Why AI behavior must be evaluated continuously
- What aspects of AI behavior are evaluated
- When evaluations are run
- How evaluation results are used operationally
- How evaluations integrate with CI/CD, observability, and compliance

This document answers the question:  
**“How do we know our AI is still behaving correctly after change?”**

---

## Core Principle

**AI behavior is production behavior.**

Changes to:
- Prompts
- Models
- Tools
- Runtime configuration

can materially change system behavior **without changing code**.

Therefore:
- AI behavior must be evaluated continuously
- Evaluation is an operational concern, not an optional exercise

---

## Why Evaluation Is Required

AI evaluation exists to prevent:

- Silent behavioral regressions
- Safety and compliance drift
- Cost and latency explosions
- Tool misuse or overreach
- Loss of user trust

Without evaluation, failures are discovered by users.  
That is unacceptable.

---

## What Is Evaluated

AI evaluation focuses on **behavior**, not intelligence.

The platform evaluates the following dimensions:

---

### 1. Functional Correctness

Does the AI:
- Follow instructions
- Respect domain rules
- Produce outputs in the expected structure
- Use tools only when appropriate

This is the baseline requirement.

---

### 2. Safety and Policy Compliance

Does the AI:
- Respect refusal rules
- Avoid disallowed content
- Follow compliance constraints (GDPR, HIPAA)
- Avoid unsafe or ambiguous outputs

Safety violations block deployment.

---

### 3. Prompt Contract Adherence

Does the AI:
- Respect prompt boundaries
- Stay within declared scope
- Avoid leaking system instructions
- Avoid performing prohibited actions

Prompt architecture is enforced via evaluation.

---

### 4. Tool Usage Behavior

When tools are involved:
- Are tool proposals valid?
- Is tool usage appropriate?
- Are proposals complete and explicit?
- Are approval requirements respected?

Improper tool behavior is a hard failure.

---

### 5. Cost and Performance Characteristics

Does the AI:
- Stay within expected token usage
- Meet latency expectations
- Avoid runaway generation

Cost regressions are treated as production issues.

---

## Evaluation Types

The platform supports multiple evaluation types.

---

### Golden Evaluations

- Fixed inputs with expected outputs
- Used to detect regressions
- Deterministic where possible

Golden evaluations are the backbone of safety.

### Technical Execution and Naming

AI evaluation tests are separated from standard unit tests to ensure execution speed and cost control.

- **Naming Convention:** AI eval tests MUST use the `.eval.test.ts` extension.
- **Isolation:** AI eval tests are excluded from standard `pnpm test` runs.
- **Execution:** Run via `pnpm eval:ai` (which maps to `turbo run eval:ai`).

Rationale:
- **Cost:** Avoid accidental model calls during fast local development.
- **Latency:** AI evals can take minutes, while unit tests take seconds.
- **Failure Modes:** AI eval failures often require different analysis than code logic failures.

---

### Schema and Contract Validation

- Validate output structure
- Enforce schemas
- Reject malformed outputs

Structural failures are hard failures.

---

### Safety and Refusal Tests

- Adversarial inputs
- Edge cases
- Boundary conditions

These tests ensure policy adherence.

---

### Statistical and Trend-Based Evaluation

- Monitor distributions over time
- Detect drift
- Identify anomalies

Used for observability, not gating alone.

---

## When Evaluations Run

Evaluations run at multiple points in the lifecycle.

---

### During Development

- Prompt changes trigger evaluation
- Model changes trigger evaluation
- Runtime changes trigger evaluation

Developers get fast feedback.

---

### In CI/CD

Evaluations are integrated into CI/CD pipelines.

- Prompt changes are gated
- Model upgrades are gated
- Runtime changes are gated

Failed evaluations block promotion.

---

### In Production (Continuous)

Production behavior is continuously evaluated via:
- Sampling
- Shadow evaluation
- Observability signals

Production evaluation detects issues missed in pre-release.

---

## Gating and Enforcement

### Hard Gates

The following failures **block deployment**:
- Safety violations
- Compliance violations
- Schema violations
- Prohibited tool behavior

These are non-negotiable.

---

### Soft Gates

The following may warn or require review:
- Cost increases
- Latency increases
- Quality degradation

Soft gates require human judgment.

---

## Ownership and Responsibility

Evaluation ownership is explicit.

| Responsibility | Owner |
|----------------|------|
| Prompt-level evals | Prompt owner |
| Service-level evals | Service owner |
| Runtime eval infra | Platform |
| CI/CD gating | Platform |
| Compliance evals | Platform |

No evaluation is ownerless.

---

## Observability Integration

Evaluation results must be:
- Logged
- Versioned
- Correlated with prompt and model versions
- Traceable to deployments

Evaluation data feeds observability dashboards.

---

## Compliance Considerations

In regulated modes:
- Evaluation data must avoid sensitive content
- Evaluation logs must follow retention rules
- Evaluation artifacts must be auditable

Evaluation strengthens compliance posture.

---

## Anti-Patterns (Explicitly Disallowed)

The following are prohibited:
- Shipping prompt changes without evaluation
- Relying on manual spot checks
- Ignoring cost regressions
- Treating evaluation as optional
- Running evaluations only in production

These practices create unacceptable risk.

---

## Evolution Over Time

Evaluation strategy is expected to evolve.

Future additions may include:
- Automated scoring models
- Cross-model comparison
- Tenant-specific evaluation profiles

Evolution must not weaken safety guarantees.

---

## Summary

AI evaluation ensures that:
- Behavior remains predictable
- Safety and compliance are enforced
- Costs remain controlled
- Trust is preserved

AI systems that are not evaluated are not production-ready.

Evaluation is not overhead.  
Evaluation is control.