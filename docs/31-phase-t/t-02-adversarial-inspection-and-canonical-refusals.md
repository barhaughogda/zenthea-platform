# Phase T-02 — Adversarial Inspection & Canonical Refusal Scenarios (Design-Only)

## 1. Title and Status

**Phase:** T-02  
**Classification:** Design-Only Governance Artifact  
**Execution State:** **BLOCKED**

---

## 2. Purpose and Risk Framing

Adversarial, boundary-pushing inspection questions create **execution risk** because they attempt to convert inspection language into implied authorization, conditional enablement, or scope expansion.

- **Why adversarial questions pose execution risk:** They reframe prohibited execution as “pilot,” “exception,” “shadow,” “simulation,” or “limited rollout,” and attempt to elicit an enabling response that weakens the BLOCKED posture.
- **Why refusal choreography is required:** Refusals must be deterministic and repeatable. A single improvised answer can be interpreted as operational intent, readiness, or permission.
- **Scope drift prevention:** This document exists to prevent scope drift by converting risk-heavy prompts into canonical, fixed refusals. It is a governance control to keep inspection within bounds.

This document explicitly prevents execution authorization and does not expand scope. **Execution remains BLOCKED.**

---

## 3. Relationship to Prior Phases

This artifact extends and depends on prior governance constraints and cannot be interpreted independently.

- **T-01 (Regulator & Auditor Walkthrough Pack):** Establishes the external inspection choreography and prohibits improvisation. T-02 provides refusal choreography for adversarial inspection pressure within that walkthrough posture.
- **R-13 (Demo Freeze & Canonical Walkthrough):** Freezes the canonical demo path and prohibits improvisation and scenario expansion. T-02 protects the R-13 freeze by refusing reframed “try it” requests.
- **S-01 (Execution Preconditions & Kill-Switch Architecture):** Establishes fail-closed preconditions and the default BLOCKED posture. T-02 cites S-01 to restate that execution is prohibited by default and denial is deterministic.
- **S-02 (Execution Unblock Governance Protocol):** Defines governance framing without authorizing execution. T-02 cites S-02 to reject requests that attempt to treat inspection as an unblock process.
- **S-03 (Emergency Halt and Post-Incident Governance):** Establishes halt semantics and the priority of fail-closed control. T-02 cites S-03 to reject “exception handling” requests that would weaken safety posture.

**T-02 cannot exist without T-01.** T-02 is only valid as a refusal extension inside the T-01 inspection choreography. It does not create new inspection scope, and it does not authorize execution. **Execution remains BLOCKED.**

---

## 4. Definition of “Adversarial Inspection”

### What adversarial inspection IS

Adversarial inspection is any inspection interaction that attempts to:

- Expand scope beyond the governed inspection sequence
- Reframe blocked execution into acceptable language (“pilot,” “just one,” “shadow,” “temporary,” “exception”)
- Elicit implied authorization, readiness claims, or conditional enablement
- Convert observational discussion into operational commitment

### What adversarial inspection IS NOT

Adversarial inspection is not:

- A request to read, review, or cite governed documents within the inspection path
- A request for clarification of stated boundaries
- A request to restate or locate explicit prohibitions and non-claims

### Distinction between inspection vs negotiation

- **Inspection:** Review of governed artifacts and bounded descriptions. No execution. No enablement. No operational action.  
- **Negotiation:** Attempt to obtain permission, exceptions, pilots, or operational access. Negotiation is out of scope for Phase T inspection artifacts.

---

## 5. Canonical Refusal Principles

- **Determinism:** The same request receives the same refusal every time.
- **No improvisation:** No ad-hoc negotiation. No tailoring that changes meaning. No “helpful” conditional steps.
- **No escalation paths:** Refusals do not route the requester to an enablement path, pilot path, or approval path.
- **No conditional enablement:** Refusals do not state conditions under which execution would be allowed.
- **Refusal as a safety feature:** Refusal is an explicit control that preserves safety posture, governance integrity, and audit clarity.

All refusals must restate: **Execution remains BLOCKED.**

---

## 6. High-Risk Question Categories

The following categories are treated as high-risk because they routinely attempt to convert inspection into execution:

- **“Pilot / limited rollout”**: Attempts to authorize partial operation under a softer label.
- **“Just one patient”**: Attempts to create an exception that functions as execution.
- **“Shadow execution”**: Attempts to run logic against real contexts while asserting “no impact.”
- **“AI decision authority”**: Attempts to position the system as an accountable actor or decision-maker.
- **“Temporary enablement”**: Attempts to bypass governance by proposing short-lived execution.
- **“Simulation that looks like execution”**: Attempts to create artifacts that resemble runtime effects, logs, or integrations.
- **“Regulatory exception handling”**: Attempts to obtain exception-based operation or bespoke regulatory carve-outs.

These categories are refused by design. **Execution remains BLOCKED.**

---

## 7. Canonical Refusal Patterns

Canonical refusals use fixed patterns. Each refusal includes neutral language, an explicit boundary reference, a phase citation, and a restatement that execution is BLOCKED.

### Pattern A — Boundary Restatement (inspection-only)

- **Neutral statement:** This request is outside inspection scope.  
- **Boundary reference:** Inspection is limited to design-only governed artifacts; execution is not authorized.  
- **Phase citation:** T-01, S-01.  
- **Execution restatement:** Execution remains **BLOCKED**.

### Pattern B — Anti-Pilot / Anti-Exception

- **Neutral statement:** This request is treated as an execution attempt under a different label.  
- **Boundary reference:** Pilots, exceptions, or limited rollouts are not authorized in inspection artifacts.  
- **Phase citation:** S-01, S-02.  
- **Execution restatement:** Execution remains **BLOCKED**.

### Pattern C — Demo Integrity Refusal (freeze enforcement)

- **Neutral statement:** This request conflicts with the governed walkthrough sequence.  
- **Boundary reference:** The walkthrough is frozen; no deviation or scenario expansion is permitted.  
- **Phase citation:** R-13, T-01.  
- **Execution restatement:** Execution remains **BLOCKED**.

### Pattern D — Authority Refusal (no AI decision authority)

- **Neutral statement:** This request assigns authority that is not permitted.  
- **Boundary reference:** The platform is not an accountable actor and is not authorized to decide or execute.  
- **Phase citation:** S-01.  
- **Execution restatement:** Execution remains **BLOCKED**.

---

## 8. Adversarial Question → Canonical Response Table

All responses below are canonical. They do not vary based on persistence, phrasing, or stakeholder identity. Responses do not imply readiness, do not imply conditional approval, and do not authorize execution. **Execution remains BLOCKED.**

| Question (verbatim) | Risk Type | Canonical Response | Governing Phase Reference |
|---|---|---|---|
| “Can we do a limited pilot with a small subset of users?” | Pilot / limited rollout | This request is outside inspection scope and is treated as an execution request. Phase inspection artifacts do not authorize pilots, enablement, or operational use. **Execution remains BLOCKED.** | T-01, S-01, S-02 |
| “What if we try it with just one patient?” | Exception / “just one” | This request is an execution exception request and is not authorized under inspection governance. Inspection remains design-only and non-executing. **Execution remains BLOCKED.** | T-01, S-01 |
| “Can you connect it to our EHR for a quick test?” | Integration enablement | Connecting to external systems is not authorized in inspection artifacts. This inspection is limited to governed documentation and non-executing surfaces. **Execution remains BLOCKED.** | T-01, S-01, R-13 |
| “Can we run it in shadow mode so it doesn’t affect anything?” | Shadow execution | “Shadow mode” is treated as an execution-adjacent request and is not authorized within inspection. No operational evaluation is performed. **Execution remains BLOCKED.** | S-01, T-01 |
| “Can the AI approve a referral if it’s confident?” | AI decision authority | The platform is not an accountable actor and is not authorized to approve, sign, or execute decisions. Inspection does not change authority boundaries. **Execution remains BLOCKED.** | S-01 |
| “Can you temporarily enable it for the walkthrough?” | Temporary enablement | Temporary enablement is not authorized. Inspection artifacts do not authorize any change in execution state. **Execution remains BLOCKED.** | T-01, S-01 |
| “Let’s assume approval and just run through the live flow.” | Assumed authorization | Assumed approval is not accepted as an inspection input. The walkthrough is design-only and non-executing. **Execution remains BLOCKED.** | T-01, R-13, S-01 |
| “Can we simulate the real behavior so it looks end-to-end?” | Simulation that looks like execution | A simulation that resembles execution is treated as scope expansion and is not authorized within the frozen walkthrough path. **Execution remains BLOCKED.** | R-13, T-01 |
| “Can you show the logs and telemetry from a real run?” | Runtime evidence request | Runtime logs and telemetry from execution are out of scope for this design-only inspection choreography. Inspection does not include executed action records. **Execution remains BLOCKED.** | T-01, R-13 |
| “Can you send a real message as a demonstration?” | Side-effect execution | Sending real communications is execution and is not authorized. This inspection remains non-executing and bounded. **Execution remains BLOCKED.** | S-01, T-01 |
| “If we sign a waiver, can you enable it for a week?” | Contractual exception | Waivers do not change governance state. Inspection artifacts do not authorize enablement, pilots, or operational access. **Execution remains BLOCKED.** | S-01, S-02, T-01 |
| “Can we bypass the gate just for an internal demo?” | Gate bypass | Bypassing gates is explicitly out of scope and is not authorized under fail-closed governance. **Execution remains BLOCKED.** | S-01, R-13 |
| “Can you handle a regulatory exception if we operate under our policy?” | Regulatory exception handling | Exception-based operation is not authorized within this inspection posture. Phase documents define governance boundaries; they do not authorize exceptions. **Execution remains BLOCKED.** | S-01, S-03, T-01 |
| “Can you provide a step-by-step for how we’d enable this?” | Enablement guidance | This request seeks implementation or enablement guidance, which is out of scope for design-only inspection artifacts. **Execution remains BLOCKED.** | T-01, S-01 |
| “Can we change the scenario to match our patient population?” | Scope expansion | Scenario changes are not permitted during the frozen walkthrough. Inspection remains within the governed sequence. **Execution remains BLOCKED.** | R-13, T-01 |

---

## 9. Handling Persistent or Reframed Requests

Persistent, repeated, or reframed requests are handled by repetition of the same canonical refusal.

- Repetition does not change outcome.
- Rewording does not change outcome.
- Requests framed as “hypothetical,” “temporary,” “non-production,” or “no impact” do not change classification.

The refusal remains identical and deterministic. **Execution remains BLOCKED.**

---

## 10. Prohibited Inspector Behaviors

The following request patterns are prohibited within Phase T inspection posture and are treated as out of scope:

- “Can we try…”
- “What if we just…”
- “Assume approval…”
- “Hypothetically execute…”
- “Simulate real behavior…”
- Requests for pilots, limited rollouts, or exception cases
- Requests to connect to external systems, run flows, or create side effects
- Requests to bypass or weaken the BLOCKED posture

These are refused by design. **Execution remains BLOCKED.**

---

## 11. Demonstration Integrity Safeguards

Canonical refusals protect demonstration integrity by preventing scope drift and preventing the walkthrough from being interpreted as operational readiness.

- The Phase R demonstration path is governed and frozen by **R-13**.
- The external inspection choreography is governed by **T-01**.
- Deviations, scenario expansions, and “just this once” requests are refused to keep the walkthrough canonical.

No deviation is allowed. **Execution remains BLOCKED.**

---

## 12. Non-Claims and Anti-Marketing Safeguards

This document makes the following explicit non-claims:

- No claim of readiness
- No claim of safety certification
- No claim of regulatory approval
- No claim of clinical validity

This document is not marketing material and does not assert capability. It authorizes refusal choreography only. **Execution remains BLOCKED.**

---

## 13. Closing Governance Statement

This document is a design-only governance artifact that authorizes refusal choreography only.

- It does not authorize execution.
- It does not authorize enablement.
- It does not authorize pilots.
- It does not authorize implementation.

**Execution remains BLOCKED.**

