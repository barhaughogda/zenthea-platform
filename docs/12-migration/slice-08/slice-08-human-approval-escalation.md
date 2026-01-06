# Slice 08 – Human Approval & Escalation

## Status
Planned

## Purpose
Introduce explicit human-in-the-loop approval and escalation mechanisms tied to governance signals, without enabling automation or changing runtime enforcement.

This slice adds **decision hooks**, not decisions.

---

## Why This Slice Exists

With Slices 06 and 07 complete, the platform can now:
- Detect governance violations
- Attribute them to agent versions and policies
- Correlate events deterministically

What is missing is:
- A formal way for humans to review, approve, escalate, or shut down behavior

---

## Core Principles

- Human decision required for action
- No autonomous enforcement
- No persistence of approvals
- No UI implementation yet
- Metadata-only, PHI-safe
- Kill-switch driven mitigation

---

## Scope

### In Scope
- Definition of ApprovalRequired signals
- Escalation tiers based on severity
- Mapping governance signals → human action playbooks
- Formal approval hooks (interfaces only)

### Out of Scope
- No UI
- No workflow engine
- No background jobs
- No policy mutation
- No automated blocking

---

## Approval Model

### Approval Triggers
Triggered by governance signals such as:
- Repeated lifecycle warnings
- Writes while disabled
- Excessive rate limiting
- Unknown agent versions in production

### Escalation Levels
- Level 1: Review (observe, no action)
- Level 2: Approve mitigation (kill switch, deprecate agent)
- Level 3: Emergency escalation (immediate disable)

---

## Interfaces

### ApprovalRequest (metadata-only)
- requestId
- triggerType
- agentVersion
- policySnapshotHash
- severity
- timestamp

### ApprovalDecision
- decision (approve | reject | defer)
- decidedBy (role only, no identity)
- timestamp

---

## Kill Switch Mapping

Approval outcomes may recommend:
- USE_*_WRITES flags
- Agent lifecycle state changes (manual, future slice)

No automated execution is allowed.

---

## Completion Criteria

- Approval interfaces defined
- Escalation rules documented
- No runtime behavior change
- pnpm typecheck passes