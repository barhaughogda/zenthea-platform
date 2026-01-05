# Slice 06 – Step 06.3: Governance Controls (Non-Blocking)

## Status
Completed

## Objective
Introduce **explicit governance control signaling** in the Tool Gateway without changing execution behavior.

This step makes governance decisions:
- Observable
- Interpretable
- Actionable by humans

…but **not enforceable** beyond existing deny-by-default logic.

No new blocking.  
No automation.  
No alerts.

---

## Core Principle

> Governance controls explain *why* something was denied, not *what to do about it*.

This step exists to:
- Reduce ambiguity during investigations
- Enable safe escalation
- Prepare for future policy review tooling

---

## Scope

### In Scope
- Governance decision classification
- Structured governance decision output
- Standardized deny reason taxonomy
- Upstream propagation of governance metadata (safe, bounded)

### Out of Scope
- Automated enforcement changes
- Auto-remediation
- Feature flag manipulation
- Provider-side effects
- UI changes

---

## Governance Decision Model

### GovernanceDecision
Every Tool Gateway invocation MUST resolve to a governance decision:

- `ALLOWED`
- `DENIED`

When denied, a **mandatory reason code** is attached.

### GovernanceReasonCode (Expanded)
Existing reason codes are extended and normalized:

- `UNKNOWN_AGENT`
- `UNKNOWN_TOOL`
- `SCOPE_DENIED`
- `FEATURE_DISABLED`
- `RATE_LIMITED`
- `VALIDATION_FAILED`

Reason codes are:
- Deterministic
- Stable
- Auditable
- Low-cardinality

---

## Control Output Contract

### GovernanceControlResult
A structured, metadata-only object emitted on every deny:

Fields:
- `decision`: `DENIED`
- `reasonCode`: GovernanceReasonCode
- `toolName`
- `agentType`
- `timestamp`

Strict rules:
- NO payloads
- NO PHI
- NO identifiers (agentId, tenantId, actorId)
- NO request correlation IDs

---

## Gateway Integration

### Execution Flow Update
In `ToolExecutionGateway.execute()`:

1. PolicyEvaluator runs
2. If denied:
   - GovernanceControlResult is constructed
   - Result is:
     - Emitted via GovernanceTelemetry
     - Counted via Governance Metrics
     - Returned upstream as `FORBIDDEN`

Behavior remains unchanged.

---

## Observability Alignment

This step MUST integrate cleanly with:
- Slice 04 telemetry
- Slice 06.2 governance metrics

No duplication.
No parallel logging paths.

---

## Safety & Compliance Rules

Hard stops:
- Governance control output MUST be metadata-only
- MUST NOT include actorId, tenantId, requestId, payloads
- MUST NOT trigger alerts
- MUST NOT mutate system state

---

## Acceptance Criteria

- [x] GovernanceControlResult type defined
- [x] Deny decisions emit control output
- [x] Reason codes are normalized and reused
- [x] No behavior change from previous slices
- [x] pnpm typecheck passes
- [x] Zero PHI verified

---

## Exit Condition

This step is complete when:
- Governance decisions are explicit and structured
- Investigations no longer require code inspection to understand denies
- The platform is ready for **policy review tooling** in future slices