# Slice 08 – Step 08.2: Escalation Playbooks

## Status
Planned

## Purpose
Define deterministic, human-readable escalation playbooks for ApprovalSignals emitted by the Tool Gateway.

This step provides **guidance only**.  
It introduces no automation, no enforcement, and no persistence.

---

## Core Principles

- Humans decide, systems inform
- No autonomous mitigation
- No PHI
- No UI assumptions
- Kill switches are the primary mitigation tool
- Every escalation must be reversible

---

## Escalation Levels

### Level 1 – Review (Low Severity)

**Typical Triggers**
- DEPRECATED_AGENT (write tools only)

**Intent**
- Informational awareness
- No immediate risk

**Recommended Actions**
- Verify agent upgrade plan exists
- Confirm deprecated agent version is expected
- Schedule migration if needed

**Explicitly Do NOT**
- Disable writes
- Change lifecycle states
- Escalate unless repeated

---

### Level 2 – Mitigation Approval (Medium Severity)

**Typical Triggers**
- RATE_LIMITED (sustained)
- SCOPE_DENIED
- UNKNOWN_TOOL
- VALIDATION_FAILED

**Intent**
- Potential misconfiguration or misuse
- Risk may escalate if ignored

**Recommended Actions**
- Inspect governance telemetry (agentVersion + policySnapshotHash)
- Verify agent permissions and scopes
- Consider temporary write disable via kill switches:
  - USE_CONSENT_WRITES
  - USE_CHAT_WRITES
  - USE_APPOINTMENT_WRITES

**Optional Actions**
- Deprecate agent version (manual)
- Roll back agent deployment (external process)

---

### Level 3 – Emergency Escalation (High Severity)

**Typical Triggers**
- UNKNOWN_AGENT
- UNKNOWN_AGENT_VERSION
- LIFECYCLE_DENIED (disabled or retired agent activity)

**Intent**
- Clear policy breach or unsafe behavior
- Immediate risk

**Required Actions**
- Disable relevant write paths immediately via kill switches
- Halt affected agent deployments
- Notify platform owner / security lead

**Post-Incident**
- Audit governance telemetry
- Review policy snapshot hash
- Decide on permanent agent retirement or policy update

---

## Kill Switch Reference

| Kill Switch | Scope |
|------------|-------|
| USE_CONSENT_WRITES | Consent write operations |
| USE_CHAT_WRITES | Messaging write operations |
| USE_APPOINTMENT_WRITES | Appointment request/cancel |

Kill switches:
- Must be runtime-configurable
- Must be reversible
- Must not require redeploy

---

## What This Step Does NOT Do

- No automatic enforcement
- No workflow engine
- No approval persistence
- No UI implementation
- No agent lifecycle mutation

---

## Completion Criteria

- Escalation levels are clearly defined
- Recommended actions are explicit and bounded
- Kill switch usage is documented
- No ambiguity between signal vs action