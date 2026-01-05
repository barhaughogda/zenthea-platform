# Slice 04 – Observability & Abuse Controls

Status: Planned  
Owner: Platform Architecture  
Phase: Post-Write Enablement  
Prerequisite: Slice 02B fully complete and locked

---

## Purpose

Introduce **high-signal observability and abuse detection** for all Tool Gateway–mediated actions.

This slice ensures:
- Early detection of misuse or probing behavior
- Clear operational visibility
- Strong governance guarantees
- Zero PHI leakage outside the audit store

This slice is **read-only from a business perspective**. No new user-facing capabilities are introduced.

---

## Core Principles

- **Zero PHI in application logs**
- **Audit ≠ Observability**
- **Deterministic rules before ML**
- **Visibility before automation**
- **Reversible and non-invasive**

---

## In Scope

- Tool Gateway telemetry (metadata only)
- Rate-limit and policy decision metrics
- Deterministic abuse detection rules
- Dashboards and alerts
- Operational runbooks

---

## Out of Scope

- New write capabilities
- UI changes
- Provider workflows
- Background jobs that take autonomous action
- ML-based detection
- Any PHI in logs or metrics

---

## Telemetry Model

### ToolGatewayEvent (emitted on every tool invocation)

Metadata only:
- toolName
- tenantId
- actorId
- actorType (patient | provider | system)
- requestId
- idempotencyKeyHash
- decision (allowed | denied | rate_limited)
- errorCode (if any)
- latencyMs
- timestamp

🚫 MUST NOT include:
- Payloads
- Patient names
- Message content
- Appointment details

---

## Abuse Detection (Deterministic Rules)

Initial ruleset (non-exhaustive):

- Excessive RATE_LIMITED events per actor
- Repeated FORBIDDEN ownership violations
- High idempotency conflict rate
- Write attempts while feature flags disabled
- Rapid fan-out across conversations or tools

### Output
- Emit AbuseSignalEvent
- Severity classification (low | medium | high)
- No automatic blocking beyond existing rate limits

---

## Dashboards

Required dashboards:
- Tool invocations by toolName
- Decision breakdown (allowed / denied / rate_limited)
- Error code distribution
- Latency percentiles (p50, p95, p99)
- Top offending actors (IDs only)

---

## Alerts

Baseline alerts:
- Sudden spike in RATE_LIMITED
- Sustained FORBIDDEN violations
- Latency degradation
- Upstream dependency failures

---

## Operational Runbook

Must include:
- How to identify abuse patterns
- Which feature flags act as kill switches
- How to trace an incident using audit records
- Escalation and containment steps

---

## Execution Plan

### Step 04.1 – Telemetry Schema & Emission
Define ToolGatewayEvent and emit at gateway boundary.

### Step 04.2 – Metrics & Counters
Expose rate-limit, decision, and latency metrics.

### Step 04.3 – Abuse Rule Engine
Evaluate telemetry against deterministic rules and emit AbuseSignalEvent.

### Step 04.4 – Dashboards & Alerts
Ship baseline dashboards and alerting configuration.

---

## Completion Criteria

- All Tool Gateway calls emit telemetry
- No PHI detected in logs or metrics
- Abuse signals observable in dashboards
- Alerts trigger correctly under test conditions
- No changes to write behavior

---

## Locked Constraints

- No PHI in observability
- No autonomous enforcement
- No contract drift
- No UI changes