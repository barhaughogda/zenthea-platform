# O-01 — Human-Confirmed Execution Simulation (Preview-Only)

## 1. Purpose and Scope

Phase O defines the design requirements for making the Zenthea platform "feel real" to users without producing any side effects. The objective is to demonstrate complete user journeys—from intent through confirmation—while maintaining absolute separation from execution.

**Core constraints:**

- **Preview-only**: All actions terminate in preview representations; no downstream effects occur.
- **Non-executing**: No external systems are invoked, no state is mutated beyond transient session memory.
- **No persistence**: No data is written to durable storage as a result of user actions.
- **No external calls**: No API requests, webhooks, or integrations are triggered.

This phase enables stakeholders to validate interaction design, governance surfaces, and trust mechanisms before any execution capability is authorized.

---

## 2. Relationship to Prior Phases

Phase O builds upon and references the following prior phases:

| Phase | Relationship |
|-------|--------------|
| **Phase E** | Non-executing slices established the foundational UI surfaces and preview patterns. Phase O extends these into complete simulated journeys. |
| **Phase F** | Execution design defined the semantic boundaries between preview and execution. Phase O operates strictly within the preview boundary. |
| **Phase G** | Simulation infrastructure established the technical patterns for stateless, side-effect-free demonstration. Phase O applies these patterns to human-confirmed flows. |
| **Phase H** | Shadow mode readiness defined observability without action. Phase O adds human confirmation surfaces to shadow-observable flows. |
| **Phase I** | Governance gating established the authority model. Phase O demonstrates these gates in preview form. |
| **Phase M** | Intelligence layers provided the reasoning capabilities. Phase O surfaces intelligence outputs with explicit human confirmation requirements. |
| **Phase N** | Demo orchestration defined the presentation layer. Phase O integrates human confirmation into orchestrated demonstrations. |

**Critical statement**: Phase O does not unblock execution. The execution boundary remains closed. Phase O demonstrates what execution would look like while maintaining complete isolation from execution capability.

---

## 3. Definitions

The following terms have precise meanings within Phase O:

### Execution
An **execution** is an irreversible external state change. Examples include:
- Writing to an EHR system
- Sending a message to a patient
- Processing a payment
- Creating a calendar booking
- Triggering an external notification

Execution requires explicit human authorization and produces audit-permanent records.

### Preview
A **preview** is a representation of intended actions. A preview:
- Shows what would typically happen if execution were authorized
- Produces no external effects
- May be discarded without consequence
- Requires no cleanup or rollback

### Simulation
A **simulation** is a complete interaction flow with no side effects. Simulation:
- Exercises the full logical path of a workflow
- Uses mock, synthetic, or read-only data
- Produces transient session state only
- Terminates without persistent artifacts

### Human Confirmation
A **human confirmation** is an explicit, attributable, role-bound acknowledgment. Human confirmation:
- Must be traceable to an authenticated identity
- Must be associated with a defined role (PATIENT, CLINICIAN, OPERATOR)
- Must be recorded with timestamp and session context
- Cannot be implied, automated, or delegated to AI

---

## 4. Goals

Phase O aims to make user journeys understandable and trustworthy through explicit human confirmation at each decision point.

### Patient Journey (Preview)
1. **Request**: Patient expresses intent (e.g., "I'd like to schedule an appointment")
2. **Preview**: System displays what would typically happen ("This would request an appointment with Dr. Smith on Tuesday at 2pm")
3. **Confirm (Simulated)**: Patient confirms understanding; system records preview confirmation without executing

### Clinician Journey (Preview)
1. **Draft**: AI generates a clinical recommendation or documentation draft
2. **Review**: Clinician reviews with full evidence attribution visible
3. **Approve (Simulated)**: Clinician confirms the draft meets clinical standards; system records preview approval without persisting

### Operator Journey (Preview)
1. **Verify Evidence**: Operator reviews audit trail, compliance status, and readiness indicators
2. **Approve Readiness (Simulated)**: Operator confirms system readiness for a given capability; system records preview approval without unblocking execution

### Trust Objectives
- **Explicit control**: Users understand exactly what each action would do
- **Transparent gating**: Users see why actions are blocked or require additional authorization
- **No surprises**: System behavior is deterministic and predictable

---

## 5. Non-Goals

Phase O explicitly excludes the following capabilities:

- **No booking**: No calendar entries, appointments, or reservations are created
- **No EHR write**: No clinical data is persisted to any health record system
- **No messaging**: No emails, SMS, push notifications, or in-app messages are sent
- **No payments**: No financial transactions, charges, or payment method validations occur
- **No integrations**: No external APIs, webhooks, or third-party services are invoked
- **No background agents**: No autonomous processes execute outside user session context
- **No silent retries**: No failed operations are automatically reattempted
- **No auto-confirmation**: No confirmations are generated without explicit human action

---

## 6. Authority and Actor Model

### Defined Roles

| Role | Authority | Phase O Capability |
|------|-----------|-------------------|
| **PATIENT** | May request, confirm intent, provide consent | May confirm preview of patient-initiated actions |
| **CLINICIAN** | May review, approve clinical content, authorize treatment | May approve preview of clinical recommendations |
| **OPERATOR** | May verify compliance, approve system readiness, audit | May approve preview of operational readiness |
| **SYSTEM** | Records events, enforces policy, never decides | Records preview confirmations; never acts as approver |

### AI Actor Constraints

**AI is never a legal actor.** AI may:
- Generate proposals
- Surface evidence
- Explain reasoning
- Recommend actions

AI may not:
- Approve any action
- Execute any action
- Confirm on behalf of a human
- Override human decisions

### Separation of Authority

The principle "no single actor can both approve and execute" is preserved conceptually even in preview mode. In preview:
- The confirming human is recorded
- The "execution" step is simulated (not performed)
- The separation is demonstrated for governance validation

---

## 7. Confirmation Surfaces (Preview Only)

### Action Button Requirements

Disabled or preview-only action buttons are permitted only if all of the following conditions are met:

1. **Labeled "PREVIEW ONLY"**: The button or action surface must display clear, unambiguous preview labeling
2. **No side effects**: Activating the button must not trigger any external state change
3. **No misleading success states**: The result must not suggest that an action was completed

### Confirmation Modal Requirements

All confirmation modals must:

1. **State "No action will be taken"**: Explicit language confirming preview-only behavior
2. **Identify required human actor**: Display which role would normally be required to authorize the action
3. **Show what would normally happen**: Describe the typical outcome if execution were authorized

### Example Confirmation Modal Content

```
┌─────────────────────────────────────────────────┐
│  PREVIEW ONLY — No action will be taken         │
├─────────────────────────────────────────────────┤
│  This preview shows what would typically happen │
│  if you confirmed this appointment request.     │
│                                                 │
│  Required authorizer: PATIENT                   │
│                                                 │
│  Typical outcome:                               │
│  • Appointment request sent to scheduling       │
│  • Confirmation notification to patient         │
│  • Calendar hold created                        │
│                                                 │
│  [Acknowledge Preview]     [Cancel]             │
└─────────────────────────────────────────────────┘
```

---

## 8. Simulated State Transitions

### Allowed Preview States

| State | Description |
|-------|-------------|
| `PROPOSAL_CREATED` | AI has generated a proposal; no human has reviewed |
| `REVIEW_REQUIRED` | Proposal awaits human review |
| `CONFIRMED_PREVIEW` | Human has confirmed understanding (preview only) |
| `RECORDED_PREVIEW` | Confirmation has been recorded in session state |
| `DENY_PREVIEW` | Human has explicitly denied or rejected |
| `ERROR_PREVIEW` | System encountered an error condition |

### Valid Transitions

```
PROPOSAL_CREATED → REVIEW_REQUIRED → CONFIRMED_PREVIEW → RECORDED_PREVIEW
                                   → DENY_PREVIEW
                                   → ERROR_PREVIEW
```

### Fail-Closed Semantics

The system must fail closed (deny/error) if any of the following are missing or invalid:

- **Identity**: No authenticated user session
- **Session**: Session expired or invalid
- **Consent**: Required consent not recorded
- **Evidence**: Required evidence not available

Fail-closed means: when in doubt, deny. No default-allow behavior is permitted.

---

## 9. Evidence and Audit Visibility (Metadata Only)

### Evidence Attribution

All previews that involve AI-generated content must display evidence attribution:

```
Based on:
• Patient record (read-only, last updated: 2024-01-15)
• Clinical guidelines v2.3
• Provider availability (read-only snapshot)
```

Evidence sources must be:
- Read-only (no write access implied)
- Timestamped (when the snapshot was taken)
- Attributable (source system identified)

### Audit Signal Constraints

Audit signals generated during preview:
- Are metadata-only
- Must not contain PHI in logs
- Must not be transmitted to external audit systems
- Must be retained only in transient session state

### Audit Availability Requirement

A preview cannot display a "successful confirmation" state if audit capture is unavailable. If the system cannot record the preview confirmation metadata, the preview must display an error state.

---

## 10. Failure, Denial, and Ambiguity UX

### Deterministic Denials

All denial conditions must be:
- **Deterministic**: Same inputs always produce same denial
- **Plain language**: User-understandable explanation provided
- **Actionable**: Where possible, indicate what would resolve the denial

### No Silent Failures

The system must never:
- Fail without user notification
- Display success when failure occurred
- Proceed past an error without acknowledgment

### Clarification Path

When user intent is ambiguous, the system must:
1. Display "Needs clarification" state
2. Present specific questions to resolve ambiguity
3. Wait for explicit user response before proceeding

### Explicit Uncertainty

When the system is uncertain, it must:
- State uncertainty explicitly ("I'm not certain whether...")
- Present options rather than assumptions
- Require human selection to proceed

---

## 11. Safety and Trust Requirements

The following must be visible at all times during preview interactions:

### Session Status
Users must see:
- Whether they are authenticated
- Their current role
- Session validity/expiration

### Consent Status
Users must see:
- Which consents have been recorded
- Which consents are pending or missing
- How consent affects available actions

### Execution Blocked Banner
All preview surfaces must display a persistent indicator:
```
⚠️ PREVIEW MODE — Execution is blocked. No actions will be taken.
```

### Language Prohibitions

The following language is prohibited unless accompanied by "preview only":
- "Submit" / "Submitted"
- "Booked" / "Booking confirmed"
- "Confirmed" / "Confirmation"
- "Sent" / "Message sent"
- "Saved" / "Changes saved"
- "Approved" / "Approval complete"

---

## 12. Explicit Prohibitions

The following are explicitly prohibited in Phase O:

- **No external API calls**: No HTTP requests to external services
- **No persistence beyond in-memory session state**: No database writes, no file writes, no cache writes
- **No background work**: No async jobs, no queues, no scheduled tasks
- **No autoplay voice**: No text-to-speech without explicit user initiation
- **No "implied execution"**: No language suggesting action was taken
- **No bypass of human confirmation**: No path that skips human acknowledgment
- **No automatic data collection**: No analytics, telemetry, or tracking beyond session metadata
- **No retry logic**: No automatic reattempts of any operation
- **No timeout-based actions**: No actions triggered by inactivity or elapsed time
- **No cross-session state**: No sharing of state between user sessions

---

## 13. Out of Scope

The following are explicitly out of scope for Phase O:

- **Implementation details**: No code specifications, no component implementations
- **Component specs**: No UI component technical specifications
- **Mobile builds**: No mobile application considerations
- **Adapter development**: No integration adapter specifications
- **Real audit pipeline implementation**: No production audit system design
- **Governance unblock procedures**: No procedures for transitioning to execution capability
- **Performance requirements**: No latency, throughput, or scaling specifications
- **Deployment specifications**: No infrastructure or deployment design
- **Testing specifications**: No test plan or test case definitions

---

## 14. Exit Criteria

Phase O is considered complete (at design level) when the following are demonstrable:

### Journey Demonstrations
- [ ] Patient preview journey: request → preview → confirm (simulated)
- [ ] Clinician preview journey: draft → review → approve (simulated)
- [ ] Operator preview journey: verify → approve readiness (simulated)

### Denial Surface Demonstrations
- [ ] SL-01 (identity) denial: deterministic denial with explanation when identity is missing
- [ ] SL-03 (consent) denial: deterministic denial with explanation when consent is missing
- [ ] Tenant mismatch denial: deterministic denial with explanation when tenant context is invalid

### Evidence and Trust Demonstrations
- [ ] Evidence attribution visible in all AI-generated preview content
- [ ] "Preview-only" language enforced across all actionable surfaces
- [ ] Session and consent status visible throughout all journeys

### Governance Validation
- [ ] All preview confirmations record: identity, role, timestamp, session
- [ ] No path exists that bypasses human confirmation
- [ ] Fail-closed behavior verified for all missing prerequisites

---

## 15. Closing Governance Statement

This document authorizes understanding and governance alignment only. It does not authorize implementation or execution.

Phase O design artifacts describe intended behavior for stakeholder review and approval. No capability described in this document is enabled, deployed, or operational until:

1. Explicit implementation authorization is granted
2. Implementation satisfies all design requirements
3. Implementation passes governance review
4. Deployment authorization is granted separately

The execution boundary remains closed. This document does not modify that constraint.

---

*Document version: 1.0*
*Phase: O (Preview-Only Human Confirmation)*
*Status: Design artifact — governance review pending*
