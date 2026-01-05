# Slice 04 – Step 04.2: Tool Gateway Metrics & Counters

Status: Planned  
Owner: Platform Architecture  
Phase: Observability & Abuse Controls  
Prerequisite: Slice 04.1 (Telemetry) complete and locked

---

## Purpose

Introduce **low-cardinality, high-signal metrics** derived from Tool Gateway activity.

Metrics provide:
- Fast operational visibility
- Abuse and degradation detection
- Alerting inputs
- A safe abstraction over raw telemetry

This step does NOT change behavior or enforce policy.

---

## Core Principles

- Metrics are **derived**, not raw
- Metadata only, zero PHI
- Low cardinality only
- Gateway-local responsibility
- No business logic coupling

---

## In Scope

- Counters
- Histograms
- Decision outcome tracking
- Latency measurement
- Error classification

---

## Out of Scope

- Alerts
- Abuse rule evaluation
- UI changes
- Background workers
- PHI inspection
- Tool behavior changes

---

## Required Metrics

### Counters

1. `tool_gateway_requests_total`
Labels:
- toolName
- decision (allowed | denied | rate_limited | error)
- actorType

2. `tool_gateway_errors_total`
Labels:
- toolName
- errorCode

3. `tool_gateway_rate_limited_total`
Labels:
- toolName
- actorType

---

### Histograms

1. `tool_gateway_latency_ms`
Labels:
- toolName
- decision

Buckets:
- 50ms
- 100ms
- 250ms
- 500ms
- 1s
- 2s
- 5s

---

## Cardinality Rules (Non-Negotiable)

MUST NOT include:
- actorId
- tenantId
- requestId
- idempotencyKey
- payload-derived values

Only stable enums and tool names are allowed.

---

## Emission Rules

- Metrics are emitted **exactly once per tool invocation**
- Emission happens at the **Tool Gateway boundary**
- Metrics MUST reflect the final decision outcome
- Metrics emission MUST NOT throw or affect control flow

---

## Exposure Model

- Metrics should be exposed via an internal metrics registry
- Export mechanism may be:
  - Prometheus-compatible
  - Or a platform abstraction already in use
- No network calls added in this step

---

## Validation Requirements

- `pnpm lint` passes
- `pnpm typecheck` passes
- No PHI appears in metrics
- Metrics match telemetry decisions
- No behavior changes to tools

---

## Completion Criteria

Step 04.2 is complete when:
- All Tool Gateway calls increment counters
- Latency histogram populated
- Error counters populated
- Metrics are queryable in dev
- Zero PHI exposure confirmed

---

## Notes

Metrics are an operational surface, not a forensic one.
Audit logs remain the source of truth for investigations.