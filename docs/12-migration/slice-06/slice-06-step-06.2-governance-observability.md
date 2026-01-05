# Slice 06: Step 06.2 Governance Telemetry and Metrics

Status: Planned
Owner: Platform Architecture
Phase: Governance
Prerequisite: Slice 06.1 complete and locked

---

## Purpose

Make agent governance decisions observable and operable.

This step introduces:
- Governance decision telemetry (metadata-only)
- Low-cardinality governance metrics
- Operator visibility into permission denials and drift attempts

This step does NOT change permissions, tools, or behavior beyond emitting observability signals.

---

## Core Principles

- Zero PHI
- Low cardinality only
- Deny reasons are observable
- No enforcement changes
- No payloads, no identifiers beyond stable categories

---

## In Scope

- Governance events for denies (already present in 06.1), plus optional allow events if safe
- Governance counters by toolName and reasonCode
- Dashboards-ready metric surfaces

---

## Out of Scope

- Alerts and runbooks (future step if needed)
- Permission changes
- Feature flag mutation
- Any storage of raw events
- Any PHI in telemetry or metrics

---

## Required Telemetry

### GovernanceEvent (metadata-only)

Fields:
- agentType
- toolName
- reasonCode (UNKNOWN_AGENT | UNKNOWN_TOOL | SCOPE_DENIED)
- timestamp

Must not include:
- agentId
- tenantId
- actorId
- requestId
- payloads

---

## Required Metrics

### Counters

1. `tool_gateway_governance_denies_total`
Labels:
- toolName
- agentType
- reasonCode

2. `tool_gateway_governance_unknown_agent_total`
Labels:
- toolName

3. `tool_gateway_governance_scope_denied_total`
Labels:
- toolName
- agentType

Cardinality hard stop:
- No agentId
- No tenantId
- No actorId
- No request identifiers

---

## Emission Rules

- Metrics emitted exactly once per denied invocation
- Telemetry and metrics must never throw
- Emission must not affect control flow

---

## Validation

- pnpm lint passes
- pnpm typecheck passes
- pnpm build passes
- Manual verification: no PHI in telemetry or metrics
- Existing behavior unchanged for allowed tool invocations

---

## Completion Criteria

- Governance denial telemetry is emitted
- Governance denial metrics are emitted
- Metrics are queryable in dev
- No PHI exposure introduced
- One commit:
  "Slice 06 Step 06.2 - Governance observability"

---