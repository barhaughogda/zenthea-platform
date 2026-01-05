# Slice 04 – Step 04.4: Alerts & Operational Runbooks

Status: Complete
Owner: Platform Architecture  
Phase: Observability & Abuse Controls  
Prerequisite: Slice 04.3 complete and locked

---

## Purpose

Operationalize observability by introducing **alerts and runbooks** on top of
existing telemetry, metrics, and abuse signals.

This step enables:
- Fast detection of incidents
- Clear, repeatable response procedures
- Human-in-the-loop control

No automation, enforcement, or behavior changes are introduced.

---

## Core Principles

- **Alerts are signals, not actions**: Alerts inform operators; they do not trigger code.
- **Humans remain in control**: Mitigation (like kill switches) is a manual operator decision.
- **Deterministic thresholds**: Triggers are based on objective metrics and rules.
- **Zero PHI everywhere**: Alert payloads must never contain regulated data.
- **Reversible and non-invasive**: Alerts do not modify system state.

---

## In Scope

- Alert definitions
- Alert severity classification
- Runbook documentation
- Mapping alerts to feature-flag kill switches

---

## Out of Scope

- Automatic blocking or mitigation
- Feature flag mutation
- Background jobs
- UI changes
- ML or anomaly detection
- PHI inspection

---

## Alert Sources

Alerts may be triggered from:
- Tool Gateway metrics (Slice 04.2)
- AbuseSignalEvent outputs (Slice 04.3)

No raw telemetry or payload inspection is allowed.

---

## Required Alerts (Baseline)

### Alert A: Excessive Rate Limiting
**Source**: `tool_gateway_rate_limited_total` (Metric) or `RULE_A_EXCESSIVE_RATE_LIMIT` (Abuse Signal)  
**Trigger**:  
- `rate_limited` count > 10 per 5 minutes for a single `toolName` and `actorType`.  
**Severity**: Medium  

---

### Alert B: Repeated Forbidden Access
**Source**: `tool_gateway_errors_total` with `errorCode=FORBIDDEN` (Metric) or `RULE_B_REPEATED_FORBIDDEN` (Abuse Signal)  
**Trigger**:  
- `FORBIDDEN` count > 5 per 10 minutes for a single `toolName`.  
**Severity**: High  

---

### Alert C: Writes While Disabled
**Source**: `tool_gateway_errors_total` with `errorCode=FEATURE_DISABLED` (Metric) or `RULE_C_WRITE_WHILE_DISABLED` (Abuse Signal)  
**Trigger**:  
- `count >= 1` of any write attempt while the feature flag is disabled.  
**Severity**: Critical  

---

### Alert D: Latency Degradation
**Source**: `tool_gateway_latency_ms` (Metric)  
**Trigger**:  
- `p95` latency > 2.0s sustained for 5 minutes across any tool.  
**Severity**: Medium  

---

## Alert Payload Rules

Alerts MUST include:
- alertId
- severity
- toolName (if applicable)
- timestamp
- triggering metric or ruleId

Alerts MUST NOT include:
- actorId
- tenantId
- payloads
- PHI
- request identifiers

---

## Operational Runbooks

### Runbook 1: Excessive Rate Limiting (Alert A)

**Condition**: A specific tool or actor type is hitting rate limits significantly more than the historical baseline.

**Verification Steps**:
1. Open the **Tool Gateway Overview Dashboard**.
2. Filter by `decision=rate_limited` and the `toolName` reported in the alert.
3. Check `tool_gateway_requests_total` to see if the total volume has increased or just the rate-limited portion.
4. Verify if this is limited to a single `actorType` (e.g., only `PATIENT` or only `CLINICIAN`).

**Dashboards to Inspect**:
- `Tool Gateway: Rate Limiting & Errors`
- `Tool Gateway: Traffic Patterns`

**Kill Switches to Use**:
- If a specific tool is being abused: Use the corresponding write-enablement kill switch (e.g., `USE_CHAT_WRITES`).
- *Note: Only use kill switches if the platform stability is at risk.*

**Escalation Path**:
- Contact **Platform Engineering** if rate limits are too low for legitimate traffic.
- Contact **Security Operations** if traffic patterns suggest a credential stuffing or scraping attempt.

---

### Runbook 2: Repeated Forbidden Access (Alert B / RULE_B)

**Condition**: A client is repeatedly attempting to access tools they are not authorized for.

**Verification Steps**:
1. Inspect the **Abuse Signals Dashboard**.
2. Locate the `AbuseSignalEvent` with `ruleId=RULE_B_REPEATED_FORBIDDEN`.
3. Check `tool_gateway_errors_total` with `errorCode=FORBIDDEN`.
4. Identify if the attempts are concentrated on sensitive tools (e.g., `UpdateMedicalRecord`).

**Dashboards to Inspect**:
- `Tool Gateway: Security & Access`
- `Abuse Signal Monitor`

**Kill Switches to Use**:
- Generally, no kill switch is used unless the volume of unauthorized requests is impacting system performance.
- Direct intervention (e.g., blocking an IP or actor at the infrastructure level) may be required.

**Escalation Path**:
- Escalated to **Security Operations** immediately for investigation of potential account compromise or privilege escalation attempts.

---

### Runbook 3: Writes While Disabled (Alert C / RULE_C)

**Condition**: Attempts to perform write operations are being made while the corresponding feature flag is set to `false`.

**Verification Steps**:
1. Check the **Feature Flag Management Console** to confirm the current state of `USE_CONSENT_WRITES`, `USE_CHAT_WRITES`, or `USE_APPOINTMENT_WRITES`.
2. Inspect `tool_gateway_errors_total` with `errorCode=FEATURE_DISABLED`.
3. Confirm if the requests are originating from an outdated client or an AI agent ignoring its context.

**Dashboards to Inspect**:
- `Tool Gateway: Feature Flag Status`
- `Abuse Signal Monitor`

**Kill Switches to Use**:
- Ensure the flag is indeed `false`.
- If a specific agent is the source, consider disabling that agent's access entirely.

**Escalation Path**:
- Contact **AI Platform Team** if an agent is repeatedly attempting disabled actions.
- Contact **Frontend Team** if a UI component is failing to respect the flag.

---

### Runbook 4: Latency Degradation (Alert D)

**Condition**: p95 latency for Tool Gateway requests exceeds 2 seconds for a sustained period.

**Verification Steps**:
1. Open **Tool Gateway Latency Dashboard**.
2. Breakdown latency by `toolName`. Identify which specific tool is slow.
3. Compare with downstream service latency metrics if available.
4. Check for correlation with high request volume (`tool_gateway_requests_total`).

**Dashboards to Inspect**:
- `Tool Gateway: Performance (p50/p95/p99)`
- `Downstream Service Health`

**Kill Switches to Use**:
- If a specific tool's latency is causing resource exhaustion (e.g., thread pool starvation): Use the kill switch for that tool category.

**Escalation Path**:
- Contact **On-call Engineer** for the specific downstream service identified as slow.
- Contact **Platform Architecture** if the Tool Gateway itself is the bottleneck.

---

## Kill Switch Mapping

These kill switches are used to mitigate issues identified by the alerts above. They must be managed via the feature flag system and require no code deployment to toggle.

| Kill Switch | Impacted Alerts | Description |
|---|---|---|
| `USE_CONSENT_WRITES` | Alert A, B, C | Disables all write operations to the Consent service. |
| `USE_CHAT_WRITES` | Alert A, B, C | Disables all write operations to the Chat service. |
| `USE_APPOINTMENT_WRITES` | Alert A, B, C | Disables all write operations to the Appointment service. |

**Verification Rules for Kill Switches**:
- **Runtime Configurable**: Must be togglable via the platform's configuration management UI.
- **Non-destructive**: Toggling off must not delete any pending data or state.
- **Immediately Reversible**: Toggling back on must restore functionality within < 30 seconds.

---

## Validation Requirements

- pnpm lint passes
- pnpm typecheck passes
- No PHI introduced
- Alerts fire under simulated conditions
- No automated enforcement added

---

## Completion Criteria

Step 04.4 is complete when:
- All baseline alerts are defined
- Runbooks exist and are documented
- Alerts can be triggered in dev/staging
- Operators can respond without code changes

---

## Notes

Alerts close the observability loop.
They are the final step before automation, not automation itself.