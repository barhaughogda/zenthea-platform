# Slice 07 – Agent Lifecycle & Versioning

## Status
Planned

## Purpose
Introduce explicit lifecycle states and versioning for agents to enable safe upgrades, controlled rollouts, deprecations, and auditability.

This slice builds directly on Slice 06 governance foundations and does NOT introduce any new enforcement beyond deny-by-default already in place.

---

## Problems This Slice Solves

- Which agent version invoked a tool?
- Can an agent be upgraded safely without breaking governance?
- Can deprecated agents be blocked deterministically?
- Can we audit which policy snapshot applied to which agent version?

---

## Core Principles

- Explicit lifecycle states
- Immutable agent versions
- Deny-by-default for unknown or deprecated agents
- Metadata-only observability
- No PHI
- No autonomous behavior
- No UI changes

---

## Agent Lifecycle Model

### Lifecycle States
- `active`: Allowed to execute tools (subject to governance)
- `deprecated`: Allowed but emits warnings/telemetry
- `disabled`: Denied at gateway
- `experimental`: Allowed only if explicitly permitted
- `retired`: Hard deny, immutable

### Versioning Rules
- Agent IDs are stable
- Versions are immutable (semver: MAJOR.MINOR.PATCH)
- Lifecycle state is attached to a specific version
- Policy snapshots must reference agent version

---

## Step Breakdown

### Step 07.1 – Agent Registry Versioning
- Introduce versioned agent registry
- Attach lifecycle state to agent versions
- Enforce deny for disabled/retired versions

### Step 07.2 – Gateway Enforcement
- Gateway validates agentId + version
- Lifecycle-based allow/deny decisions
- Metadata-only governance telemetry

### Step 07.3 – Observability & Audit
- Emit agentVersion in governance telemetry
- Correlate with policy snapshots
- Zero PHI, low cardinality only

---

## Non-Goals

- No runtime agent mutation
- No rollout automation
- No approval workflows
- No UI or product changes

---

## Completion Criteria

- Unknown agent versions are denied
- Deprecated agents emit warnings
- Disabled/retired agents are blocked
- Policy snapshots include agent version hashes
- pnpm lint, typecheck, build pass