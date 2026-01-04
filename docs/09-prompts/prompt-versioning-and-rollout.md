# Prompt Versioning and Rollout

## Purpose

This document defines how prompts are versioned, selected, deployed, rolled out, and rolled back in the platform.

It explains:
- How prompt versions are named and stored
- How versions are selected at runtime
- How prompts are rolled out safely
- How rollbacks work
- How prompt changes interact with CI/CD and observability

This document answers the question:  
**“How do we change prompt behavior in production without breaking trust?”**

---

## Prompts Are Versioned Artifacts

Every prompt is a versioned artifact.

Rules:
- No prompt is ever modified in place
- Every change creates a new version
- Old versions remain available until explicitly deprecated
- Version history must be auditable

If you overwrite a prompt, you have lost control.

---

## Versioning Scheme

Each prompt version must include:

- Prompt name
- Semantic version number
- Optional descriptive suffix

Recommended format:

@..

Examples:
- `chat-system@1.0.0`
- `sales-task-qualify-lead@2.1.0`
- `policy-hipaa@1.0.3`

---

## Semantic Versioning Rules

Prompt versions follow semantic versioning semantics:

### Major
- Changes prompt intent or responsibility
- Alters output structure or guarantees
- Requires revalidation and possibly ADR

### Minor
- Improves behavior without changing contracts
- Refines wording or constraints
- Expected to be backward compatible

### Patch
- Clarifies language
- Fixes typos or minor ambiguity
- No behavior change expected

Version numbers must reflect risk.

---

## Prompt Storage Structure

Prompts are stored in versioned files.

Example:

prompt-templates/task/
qualify-lead/
1.0.0.md
1.1.0.md
2.0.0.md

Rules:
- Each version is a separate file
- Files are immutable once merged
- Metadata is included at the top of each file

---

## Prompt Selection at Runtime

Prompt versions are selected via configuration.

Rules:
- No hardcoded prompt versions in code
- Prompt selection is explicit
- Prompt selection is observable
- Prompt selection may vary by tenant

Example configuration:

salesAgent:
prompts:
qualifyLead: “qualify-lead@1.1.0”

Configuration controls behavior, not code.

---

## Default Prompt Versions

Each prompt must have a defined default version.

Rules:
- Defaults are conservative and well-tested
- Defaults must be documented
- Defaults must work in regulated modes if applicable

Defaults represent the platform’s baseline behavior.

---

## Rollout Strategies

Prompt rollouts must use one of the following strategies.

### 1. Global Rollout

- Update default version
- All tenants receive the change

Used only for:
- Low-risk patch changes
- Clearly backward-compatible improvements

---

### 2. Tenant-Scoped Rollout

- Select new version for specific tenants
- Monitor behavior and metrics
- Expand rollout gradually

This is the preferred strategy.

---

### 3. Feature-Flagged Rollout

- Prompt version selected via feature flag
- Enables rapid enable/disable
- Useful for experimental prompts

Feature flags must be temporary.

---

## Rollout Gates

Before promoting a prompt version:

- All prompt tests must pass
- AI evals must meet thresholds
- Cost and latency impact must be reviewed
- Policy compliance must be verified

If any gate fails, rollout is blocked.

---

## Rollback Strategy

Rollback must be immediate.

Rules:
- Rollback is done by config change only
- No code deployment required
- Previous version must remain available
- Rollback events must be logged

Prompt rollback should take minutes, not hours.

---

## Observability During Rollout

During rollout, observe:

- Version usage distribution
- Error and refusal rates
- Output quality metrics
- Cost and latency metrics
- Policy violations

If metrics degrade, stop or rollback.

---

## Prompt Deprecation

Prompt deprecation is explicit.

Steps:
1. Mark version as deprecated
2. Document replacement version
3. Monitor remaining usage
4. Remove after grace period

Rules:
- No silent removals
- No breaking dependencies
- Deprecation timelines must be documented

---

## Emergency Prompt Changes

Emergency changes are allowed only for:
- Safety issues
- Compliance violations
- Severe production impact

Rules:
- Emergency versions must be clearly labeled
- Full post-mortem is required
- Emergency paths must not become normal paths

---

## Prompt Version Ownership

Each prompt must have:
- An owner
- A documented purpose
- A version history
- A current recommended version

Ownership prevents prompt sprawl.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Editing prompts in place
- Hardcoding prompt versions
- Rolling out without metrics
- Skipping evaluation for speed
- Allowing prompt drift between environments

These patterns destroy control.

---

## Summary

Prompt versioning and rollout ensure that:
- Prompt changes are explicit
- Risk is managed deliberately
- Rollbacks are fast
- Behavior remains observable
- AI systems remain trustworthy

Prompts change often. Control must be constant.