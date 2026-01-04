# Prompt Testing and Evaluations

## Purpose

This document defines how prompts are tested and evaluated in this platform.

It explains:
- Why prompt testing is mandatory
- Which types of tests are required
- How evaluations are structured
- How regressions are detected and blocked
- How prompt quality is measured over time

This document answers the question:  
**“How do we know a prompt works before and after we change it?”**

---

## Why Prompt Testing Exists

Prompts are executable behavior.

Changing a prompt can:
- Change outputs silently
- Introduce hallucinations
- Break compliance guarantees
- Increase cost or latency
- Degrade user trust

Untested prompts are equivalent to untested code.

---

## Prompt Testing Principles

All prompt testing follows these principles:

- Deterministic where possible
- Automated in CI
- Version-aware
- Focused on behavior, not style
- Designed to catch regressions early

If a prompt cannot be tested, it should be redesigned.

---

## Types of Prompt Tests

Every production prompt must be covered by one or more of the following test types.

---

## 1. Golden Input/Output Tests

### Purpose

Verify that known inputs produce acceptable outputs.

### Structure

Each test includes:
- Prompt version
- Fixed input
- Expected output (or constraints)
- Acceptance criteria

Golden outputs do not need to match verbatim, but must:
- Match schema
- Preserve meaning
- Respect constraints

---

### Example Assertions

- Required fields are present
- Values fall within expected ranges
- No forbidden content appears
- Output structure is stable

Golden tests are the first line of defense.

---

## 2. Schema Validation Tests

### Purpose

Ensure outputs conform to strict schemas.

### What Is Validated

- JSON shape
- Field presence
- Field types
- Enum values
- Optional vs required fields

Rules:
- Schema failures are hard failures
- Partial outputs are rejected
- Schema changes require test updates

Schema validation enforces discipline.

---

## 3. Safety and Refusal Tests

### Purpose

Ensure prompts refuse unsafe or invalid requests.

### Test Cases Include

- Out-of-scope instructions
- Attempts to bypass policy
- Requests for sensitive or prohibited actions
- Ambiguous or adversarial input

Expected outcomes:
- Clear refusal
- Proper escalation
- No partial compliance

A prompt that never refuses is unsafe.

---

## 4. Policy Compliance Tests

### Purpose

Verify that prompts respect policy constraints.

### Examples

- No PHI exposure in restricted modes
- No speculative medical advice
- No unauthorized financial decisions
- No tool use outside allowed scope

Policy tests must run in:
- Standard mode
- Regulated mode (for example HIPAA)

Policy regressions block deployment.

---

## 5. Regression Tests

### Purpose

Detect unintended behavior changes.

### How It Works

- Compare outputs across prompt versions
- Measure deltas in structure, meaning, and constraints
- Flag unexpected divergence

Regression tests protect against “harmless” wording changes that are not harmless.

---

## 6. Cost and Latency Evaluations

### Purpose

Ensure prompt changes do not introduce runaway cost or latency.

Metrics include:
- Token usage
- Execution time
- Tool invocation count
- Retry frequency

Rules:
- Thresholds must be defined
- Regressions must be reviewed
- Large cost increases block promotion

AI performance is part of correctness.

---

## 7. Fallback and Failure Mode Tests

### Purpose

Ensure graceful behavior under failure.

Test scenarios:
- Model timeout
- Tool failure
- Partial input
- Memory unavailability

Expected behavior:
- Explicit failure
- Defined fallback
- No silent degradation

Failure handling must be intentional.

---

## Evaluation Environments

Prompt evaluations must run in:

- Local (limited)
- CI
- Staging
- Production (monitoring only)

Rules:
- CI evals block merges
- Staging evals gate production
- Production evals monitor drift

Production is not a test bed.

---

## Prompt Evaluation Data Management

Rules:
- Test inputs must be synthetic or anonymized
- No real PHI or PII in evals
- Test data must be versioned
- Expected outputs must be reviewed

Eval data is part of the system.

---

## Human Review in Evaluations

Not all quality can be automated.

Human review is required for:
- New prompts
- Major prompt rewrites
- High-risk domains
- Compliance-sensitive prompts

Human review complements automated evals.

---

## CI/CD Integration

Prompt tests must:
- Run automatically on PRs
- Be scoped to affected prompts
- Fail fast on regression
- Produce clear failure output

Prompt test failures block merges.

---

## Observability of Prompt Tests

Prompt test runs must emit:
- Prompt version
- Model used
- Pass/fail results
- Cost metrics
- Failure reasons

Test observability enables improvement.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Manual testing only
- Snapshotting raw text blindly
- Ignoring cost regressions
- Testing only “happy paths”
- Updating expected outputs without review

These patterns create false confidence.

---

## Summary

Prompt testing and evaluation ensure that:
- Prompt behavior is predictable
- Regressions are caught early
- Compliance is enforceable
- Costs are controlled
- AI behavior improves over time

If prompts are not tested, the system is guessing.

Testing turns prompts into engineering.