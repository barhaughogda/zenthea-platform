# Slice 06: Agent Governance and Permissions

Status: Completed

## Evidence
- `packages/tool-gateway/src/governance.ts`: Centralizes `AGENT_REGISTRY`, `TOOL_SCOPE_MAPPING`, `PolicyEvaluator`, and `generatePolicySnapshot`.
- `packages/tool-gateway/src/gateway.ts`: Enforces policies via `emitGovernanceControl` on the validation path.
- `packages/tool-gateway/src/metrics.ts`: Implements governance-specific counters for observability (denies, reason codes).
- `packages/tool-gateway/src/governance.test.ts`: Validates the policy evaluator and snapshot deterministic logic.

## Progress Detail
- **Step 06.1**: Completed (Agent permission model and registry)
- **Step 06.2**: Completed (Governance telemetry and metrics)
- **Step 06.3**: Completed (Enforcement in Tool Gateway)
- **Step 06.4**: Completed (Governance policy snapshots)

---

## Purpose

Define and enforce a platform-wide governance model for agents so that:
- Every agent has an explicit, reviewable permission set
- Tool usage is deny-by-default
- Unauthorized tool use is blocked at the Tool Gateway boundary
- Changes are auditable and observable without PHI leakage

This slice prevents permission drift and accidental autonomy.

---

## Core Principles

- Deny by default
- Explicit tool scopes per agent
- Enforcement at Tool Gateway boundary only
- No PHI in logs, metrics, telemetry, or governance events
- Human-reviewed changes (PR driven)

---

## In Scope

- Agent capability declarations (static config)
- Tool permission model and policy evaluation
- Tool Gateway enforcement
- Governance telemetry and metrics (metadata only)
- Documentation and runbooks for permission changes

---

## Out of Scope

- New user-facing features
- New tool implementations
- Provider workflows
- Autonomous behaviors
- Background schedulers or agents acting without a user trigger

---

## Definitions

Agent:
- A service that may request tool execution via Tool Gateway

Tool Scope:
- A named permission granting access to one or more tool actions
- Example: consent.read, consent.write, chat.read, chat.write, appointment.read, appointment.write

Policy:
- A rule set that determines whether a given agent may invoke a tool action in a given context

---

## Required Guarantees

1. Every tool execution request includes:
- agentId (service identity)
- toolName
- actorType
- requestId
- idempotencyKey (for writes, already enforced)
- approval metadata (existing pattern)

2. Tool Gateway must enforce:
- Is the agentId recognized?
- Is the toolName permitted for that agent?
- Is the requested action permitted for that actorType?

3. Deny by default:
- Unknown agentId is denied
- Missing policy is denied
- Tool not in allowlist is denied

4. Observability:
- All deny decisions emit governance events (metadata only)
- Metrics track denies by toolName and reasonCode

---

## Slice Plan

### Step 06.1: Agent Permission Model
- Define tool scopes and agent permission declarations
- Implement policy evaluation in Tool Gateway
- Enforce deny-by-default

### Step 06.2: Governance Telemetry and Metrics
- Emit governance decision events
- Counters by toolName and decision reason
- No PHI, no identifiers beyond toolName and agentId category

### Step 06.3: Change Process and Runbook
- Document how to add tools, scopes, and agent permissions safely
- Include review checklist and rollback steps

---

## Completion Criteria

- Tool Gateway denies unpermitted tool invocations
- Denies are observable via telemetry and metrics
- No PHI exposure introduced
- pnpm lint, pnpm typecheck, pnpm build pass
- One commit per step, no scope creep

---