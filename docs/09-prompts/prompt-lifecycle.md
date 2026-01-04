# Prompt Lifecycle

## Purpose

This document defines the lifecycle of a prompt in the platform.

It explains:
- How prompts are created
- How prompts are reviewed and tested
- How prompts are deployed and rolled out
- How prompts are monitored and evolved
- How prompts are deprecated and retired

This document answers the question:  
**“How do prompts move from idea to production without introducing hidden risk?”**

---

## Prompts as Living Artifacts

Prompts are living artifacts.

They:
- Change over time
- Improve through feedback
- Accumulate context and constraints
- Must be maintained deliberately

Prompt changes are expected. Uncontrolled prompt changes are not.

---

## The Prompt Lifecycle Stages

Every prompt moves through the following stages:

1. Draft
2. Review
3. Test
4. Stage
5. Deploy
6. Observe
7. Iterate
8. Deprecate

Skipping stages is not allowed.

---

## Stage 1: Draft

### Purpose

Create or modify a prompt to address a specific need.

### Activities

- Define the prompt layer (system, policy, domain, task, memory)
- Write the prompt in plain, explicit language
- Add comments explaining intent and constraints
- Assign an initial version

### Rules

- Drafts must be scoped to one responsibility
- Drafts must not introduce new authority
- Drafts must not bypass policy

Drafts live in Git but are not active.

---

## Stage 2: Review

### Purpose

Ensure the prompt is safe, understandable, and aligned.

### Review Checklist

- Does the prompt follow the prompt architecture?
- Are responsibilities clearly scoped?
- Are constraints explicit?
- Is language unambiguous?
- Could this prompt be misused or misinterpreted?

### Rules

- Reviews are mandatory
- AI-generated prompts require human review
- Review feedback must be documented

If a reviewer cannot explain the prompt, it fails review.

---

## Stage 3: Test

### Purpose

Validate prompt behavior before exposure.

### Required Tests

- Golden input/output tests
- Schema validation tests
- Safety and refusal tests
- Policy compliance tests

### Rules

- Tests must be deterministic
- Tests must run in CI
- Failing tests block progression

Untested prompts do not ship.

---

## Stage 4: Stage

### Purpose

Validate prompts in a production-like environment.

### Activities

- Enable the prompt in staging
- Run realistic workflows
- Observe AI behavior
- Validate cost, latency, and quality

### Rules

- Staging uses strict policy mode
- Prompt versions are pinned
- No silent fallbacks

Staging is where surprises should happen.

---

## Stage 5: Deploy

### Purpose

Activate the prompt in production.

### Deployment Methods

- Configuration-based version switch
- Tenant-scoped rollout
- Feature flag gating

### Rules

- No direct code deploy required
- Deployment must be auditable
- Rollback must be immediate

Prompt deployment must be reversible.

---

## Stage 6: Observe

### Purpose

Understand real-world prompt behavior.

### Required Signals

- Prompt version usage
- Output quality metrics
- Error and fallback rates
- Cost and latency metrics
- Policy violation signals

### Rules

- Observation is mandatory
- Silent failures are unacceptable
- Metrics must be reviewed regularly

If you are not observing, you are guessing.

---

## Stage 7: Iterate

### Purpose

Improve prompts based on data and feedback.

### Activities

- Adjust wording
- Refine constraints
- Improve output consistency
- Reduce cost or latency
- Address edge cases

### Rules

- Iterations repeat the full lifecycle
- Version numbers must increment
- Changes must be documented

Small iterations beat large rewrites.

---

## Stage 8: Deprecate

### Purpose

Retire prompts that are no longer needed.

### Deprecation Process

- Mark prompt as deprecated
- Document replacement prompt
- Monitor usage
- Remove after grace period

### Rules

- No silent removals
- No breaking prompt dependencies
- Deprecation must be documented

Dead prompts create confusion.

---

## Emergency Prompt Changes

In rare cases, emergency changes may be required.

Allowed only for:
- Safety issues
- Compliance violations
- Severe production failures

Rules:
- Emergency changes must be logged
- Full lifecycle review must follow
- Root cause analysis is required

Emergency paths are exceptions, not norms.

---

## Prompt Ownership

Every prompt must have:
- A clear owner
- A documented purpose
- A review history

Ownership prevents prompt sprawl.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Editing prompts directly in production
- Skipping testing for speed
- Making multiple changes without versioning
- Treating prompts as “temporary”
- Letting prompts diverge silently

These patterns create unpredictable systems.

---

## Summary

The prompt lifecycle ensures that:
- Prompts evolve safely
- Changes are tested and observable
- Rollbacks are easy
- Compliance and policy remain enforceable

Prompts are powerful. This lifecycle keeps them under control.