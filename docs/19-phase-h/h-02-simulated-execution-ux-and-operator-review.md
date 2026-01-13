# H-02 — Simulated Execution UX & Operator Review Surface

**Phase:** H  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Context and Relationship to H-01

This document extends **H-01 — Execution Simulation & Dry-Run Architecture** by defining the human-facing surfaces through which simulation is experienced, reviewed, and governed.

H-01 establishes the architectural foundation for simulation-only validation — defining what dry-run execution means, how it flows through the system, and where execution boundaries are enforced. **H-02 addresses how humans perceive, interact with, and review simulated execution.**

| Artifact | Scope |
|----------|-------|
| **H-01** | Architecture, data flow, audit semantics, technical boundaries |
| **H-02** | Human perception, UX surfaces, operator review, presentation of simulation state |

**Dependency:** H-02 assumes all architectural constraints from H-01 are in force. This document does not modify or extend those constraints — it describes how they are surfaced to humans.

**Critical Principle:** Every UX surface described in this document presents simulation state only. No surface described herein may trigger, authorize, or imply real execution.

---

## 2. Design Goals

### 2.1 Trust

Simulation UX must build trust through transparency. Users must trust that:

- What they see is an accurate representation of what *would* happen
- No action is being taken on their behalf without explicit, separate authorization
- The system is not deceiving them about execution state
- Simulation results are clearly distinguished from real outcomes

**Trust Failure Mode:** If a user cannot distinguish simulation from execution, trust is broken. This is a critical design failure.

### 2.2 Transparency

Every simulation surface must make the following immediately apparent:

| Element | Requirement |
|---------|-------------|
| **Mode** | User knows they are in simulation mode |
| **Scope** | User knows what is being simulated |
| **Boundary** | User knows where simulation ends and execution would begin |
| **Outcome** | User knows the result is simulated, not real |
| **Action State** | User knows no action has been taken |

### 2.3 No Illusions of Execution

The UX must actively prevent users from believing execution has occurred:

- No success indicators that could be mistaken for execution success
- No confirmation language implying action completion
- No state persistence that suggests real-world effect
- No progression indicators implying irreversible action
- No celebratory or completion-oriented UI patterns

**Explicit Statement:** Simulation success ≠ Execution success. The UX must never conflate these states.

---

## 3. Simulated Execution UX Principles

### 3.1 Mandatory Visual Differentiation

All simulation surfaces must be visually distinct from execution surfaces:

| Principle | Implementation |
|-----------|----------------|
| **Color Coding** | Simulation uses amber/yellow palette; never green (success) or red (failure in execution context) |
| **Persistent Badge** | "SIMULATED / NO ACTION TAKEN" badge visible at all times during simulation |
| **Border Treatment** | Simulation containers use dashed or patterned borders, never solid |
| **Typography** | Simulation labels use distinct typeface weight or style |
| **Icon System** | Simulation uses distinct iconography (e.g., dotted circle, not solid checkmark) |

### 3.2 Language Requirements

All text in simulation surfaces must adhere to these requirements:

| Requirement | Example (Correct) | Example (Incorrect) |
|-------------|-------------------|---------------------|
| **Action Labels** | "Simulate Booking" | "Book" |
| **Result Headers** | "Simulation Result" | "Result" |
| **Confirmation Text** | "Simulation complete — no action taken" | "Complete" |
| **Button Labels** | "Run Simulation" | "Submit" |
| **Status Indicators** | "Simulated outcome computed" | "Success" |

### 3.3 Temporal Indicators

Users must understand the temporal relationship between simulation and potential execution:

- Simulation timestamp displayed prominently
- No implication that simulation result is "locked in" or guaranteed
- Clear statement that real execution would require separate authorization
- Session-scoped indicator showing simulation expires with session

### 3.4 No Implied Progression

Simulation UX must not create the impression of forward momentum toward execution:

| Prohibited Pattern | Rationale |
|--------------------|-----------|
| "Step 1 of 3: Simulate → Step 2: Review → Step 3: Execute" | Implies execution follows naturally |
| Progress bars that continue toward "execution" | Suggests simulation is prerequisite to execution |
| "Simulation successful — proceed to execution" | Implies execution is the expected next step |
| "Ready to execute" messaging | Creates execution expectation |

---

## 4. Patient-Facing Simulation UX

### 4.1 Context

Patients may interact with simulation surfaces when:

- Exploring what an action would do before requesting it
- Reviewing what the system proposes before consenting
- Understanding the scope of a proposed care action

### 4.2 Patient Simulation Display Requirements

| Element | Requirement |
|---------|-------------|
| **Header** | "Preview — This is a simulation. No action has been taken." |
| **Visual Treatment** | Amber background tint with dashed container border |
| **Action Description** | "If you request this, the system would [action description]" |
| **Outcome Preview** | "Simulated outcome: [outcome description]" |
| **Footer** | "This preview shows what would happen. No appointment, prescription, or record has been created." |

### 4.3 Patient Consent in Simulation Context

**Critical Constraint:** Simulation does not satisfy consent requirements. Consent gathered during simulation is informational only and must not be stored or referenced as authorization for execution.

| Consent Element | Simulation Behavior |
|-----------------|---------------------|
| **Consent Prompt** | "Do you understand what this action would do?" (informational) |
| **Consent Recording** | NOT RECORDED — simulation consent is not persisted |
| **Consent Reuse** | PROHIBITED — simulation consent cannot authorize execution |
| **Consent Language** | "I understand what this simulation shows" (not "I consent to this action") |

### 4.4 Patient-Facing Prohibited Patterns

| Pattern | Why Prohibited |
|---------|----------------|
| "Your appointment has been simulated" | Implies appointment exists |
| "Simulation complete — confirm to book" | One-click path to execution |
| Storing patient "simulation preferences" | Persistence beyond session |
| "Based on your simulation, we recommend..." | Treating simulation as authority |

---

## 5. Clinician-Facing Simulation UX

### 5.1 Context

Clinicians may interact with simulation surfaces when:

- Evaluating proposed care plans before authorization
- Reviewing AI-generated recommendations in preview mode
- Validating clinical decision support suggestions
- Training or familiarizing themselves with system behavior

### 5.2 Clinician Simulation Display Requirements

| Element | Requirement |
|---------|-------------|
| **Mode Indicator** | Persistent "SIMULATION MODE — CLINICAL PREVIEW" banner |
| **Clinical Data** | All patient data displayed with "[SIMULATION CONTEXT]" watermark |
| **Proposed Actions** | Listed as "Proposed (Not Executed)" with amber indicator |
| **Clinical Decision Points** | Marked as "Decision Point — Simulation Only" |
| **Documentation** | No clinical documentation is generated or stored |

### 5.3 Clinical Workflow Simulation

When simulating clinical workflows:

| Workflow Element | Simulation Behavior |
|------------------|---------------------|
| **Order Entry** | Order displayed as "Simulated Order — Not Submitted" |
| **Prescription** | Prescription displayed as "Simulated Rx — Not Transmitted" |
| **Referral** | Referral displayed as "Simulated Referral — Not Sent" |
| **Documentation** | Note displayed as "Simulated Note — Not Recorded" |
| **Scheduling** | Appointment displayed as "Simulated Slot — Not Reserved" |

### 5.4 AI Recommendation Simulation

When AI generates clinical recommendations in simulation:

| Element | Requirement |
|---------|-------------|
| **Recommendation Header** | "AI-Generated Recommendation — Simulation Preview" |
| **Confidence Display** | "Simulated confidence: [value] — not clinically validated" |
| **Evidence Links** | "Simulated evidence retrieval — sources not verified for this session" |
| **Action Buttons** | "View Simulated Rationale" (never "Accept Recommendation") |

### 5.5 Clinician-Facing Prohibited Patterns

| Pattern | Why Prohibited |
|---------|----------------|
| "Sign simulation" or "Attest to simulation" | Implies clinical validity |
| Copying simulation results to clipboard for EHR | Enables unauthorized persistence |
| "Simulation matches clinical guidelines" | Implies clinical authority |
| Pre-populating execution forms from simulation | Creates execution shortcut |

---

## 6. Operator / Governance Review Surface

### 6.1 Purpose

The Operator Review Surface enables governance actors to:

- Review simulation results for policy compliance
- Validate that governance gates functioned correctly
- Assess readiness for potential future execution authorization
- Audit simulation behavior for anomalies

### 6.2 Operator Dashboard Requirements

| Component | Requirement |
|-----------|-------------|
| **Page Header** | "Governance Review — Simulation Audit Surface" |
| **Mode Lock Indicator** | "System Mode: SIMULATION ONLY — Execution Blocked" |
| **Simulation Log Table** | All simulations listed with actor, timestamp, scope, outcome |
| **Gate Evaluation Display** | Each governance gate result shown with evidence |
| **Boundary Verification** | Confirmation that execution boundary was not crossed |

### 6.3 Simulation Audit View

Operators must be able to review individual simulation runs:

| View Element | Content |
|--------------|---------|
| **Simulation ID** | Unique identifier for the simulation run |
| **Initiating Actor** | Human who authorized the simulation |
| **Simulation Scope** | What was simulated (action type, patient context if applicable) |
| **Gate Results** | Table of all gates evaluated with pass/fail/block status |
| **Boundary Log** | Record showing execution boundary was reached and blocked |
| **Simulated Outcome** | What the outcome would have been |
| **Evidence Markers** | All `SIMULATION_ONLY` markers verified present |

### 6.4 Governance Gate Review

For each governance gate evaluated during simulation:

| Gate Display Element | Requirement |
|----------------------|-------------|
| **Gate Name** | Clear identification of which gate |
| **Evaluation Input** | What data was provided to the gate |
| **Evaluation Result** | Pass / Fail / Blocked |
| **Gate Evidence** | Audit record produced by gate |
| **Simulation Marker** | Confirmation that gate knew it was evaluating simulation |

### 6.5 Operator Action Constraints

| Permitted Actions | Prohibited Actions |
|-------------------|-------------------|
| View simulation logs | Modify simulation records |
| Export simulation reports (marked as simulation) | Export as execution evidence |
| Flag simulations for review | Approve simulations for execution |
| Add governance notes to simulation records | Delete or hide simulation records |
| Request additional simulation runs | Directly trigger execution from review surface |

### 6.6 Escalation Paths (Simulation Context)

If an operator identifies a governance concern during simulation review:

| Concern Type | Escalation Path |
|--------------|-----------------|
| Gate evaluated incorrectly | Flag for architecture review (design-only) |
| Boundary marker missing | Flag for architecture review (design-only) |
| Simulation behaved unexpectedly | Log anomaly report (simulation-scoped) |
| Policy violation in simulation | Document finding (no execution impact) |

**Critical Constraint:** Escalation paths in simulation context may only produce documentation and flags. They may not trigger execution, rollback, or compensation.

---

## 7. Execution Preview vs Execution Reality (Explicit Separation)

### 7.1 Fundamental Distinction

| Concept | Definition | Phase H Status |
|---------|------------|----------------|
| **Execution Preview** | What the system shows *would* happen | AUTHORIZED in H-02 |
| **Execution Reality** | What actually happens in external systems | BLOCKED — Not authorized |

### 7.2 UX Separation Requirements

The UX must maintain absolute separation between preview and reality:

| Separation Requirement | Implementation |
|------------------------|----------------|
| **No Shared Affordances** | Preview buttons never share design with execution buttons |
| **No Shared Language** | Preview text never uses execution-implying words |
| **No Shared State** | Preview state never persists to execution state stores |
| **No Shared Confirmation** | Preview confirmation never doubles as execution consent |
| **No Shared Navigation** | Preview flows never lead directly to execution flows |

### 7.3 Visual Separation Schema

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SIMULATION / PREVIEW SURFACE                        │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │  [AMBER BACKGROUND]                                              │   │
│   │                                                                  │   │
│   │  ╔═══════════════════════════════════════════════════════════╗  │   │
│   │  ║  SIMULATED / NO ACTION TAKEN                              ║  │   │
│   │  ╚═══════════════════════════════════════════════════════════╝  │   │
│   │                                                                  │   │
│   │  Preview of: [Action Description]                               │   │
│   │  Simulated Outcome: [Outcome Description]                       │   │
│   │                                                                  │   │
│   │  ┌─────────────────────────────────────────────────────────┐   │   │
│   │  │  This is a preview only.                                │   │   │
│   │  │  No external system has been contacted.                 │   │   │
│   │  │  No record has been created or modified.                │   │   │
│   │  │  No appointment, order, or action has been initiated.   │   │   │
│   │  └─────────────────────────────────────────────────────────┘   │   │
│   │                                                                  │   │
│   │  [ Close Preview ]                                              │   │
│   │  (Dashed border button, amber tint)                             │   │
│   │                                                                  │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│   ════════════════════════════════════════════════════════════════════  │
│   ║            EXECUTION BOUNDARY — CROSSING PROHIBITED             ║  │
│   ════════════════════════════════════════════════════════════════════  │
│                                                                         │
│   [ Execution surfaces do not exist in Phase H ]                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.4 State Isolation

| State Type | Simulation Behavior | Execution Behavior (Future, Not Authorized) |
|------------|---------------------|---------------------------------------------|
| **Session State** | Permitted within session | N/A — Execution not authorized |
| **Persistent State** | PROHIBITED | N/A — Execution not authorized |
| **Audit State** | Permitted with `SIMULATION_ONLY` marker | N/A — Execution not authorized |
| **User Preference State** | PROHIBITED | N/A — Execution not authorized |

---

## 8. Failure, Denial, and Ambiguity Presentation

### 8.1 Failure Presentation

When simulation encounters a failure condition:

| Failure Display Element | Requirement |
|-------------------------|-------------|
| **Header** | "Simulation Encountered an Issue — No Action Was Attempted" |
| **Failure Description** | Clear explanation of what failed during simulation |
| **Boundary Confirmation** | "The execution boundary was not reached. No external effect occurred." |
| **Retry Statement** | "Simulation retry is not available. A new simulation may be requested." |
| **Visual Treatment** | Amber with caution iconography (not red error states) |

### 8.2 Denial Presentation

When a governance gate denies during simulation:

| Denial Display Element | Requirement |
|------------------------|-------------|
| **Header** | "Simulation Blocked by Governance Gate — No Action Was Attempted" |
| **Gate Identification** | Which gate blocked and why |
| **Denial Reason** | Human-readable explanation of denial |
| **Implication Statement** | "If this were a real execution request, it would also be denied for the same reason." |
| **No Override Path** | No UI affordance to bypass or override the denial |

### 8.3 Ambiguity Presentation

When simulation state is ambiguous or uncertain:

| Ambiguity Display Element | Requirement |
|---------------------------|-------------|
| **Header** | "Simulation Result Uncertain — No Action Was Attempted" |
| **Ambiguity Explanation** | What caused the uncertainty |
| **Conservative Statement** | "When uncertain, the system blocks action. This simulation was terminated without reaching a definite outcome." |
| **Outcome Statement** | "Simulated outcome: INDETERMINATE" |
| **No Retry Affordance** | No button to "try again" or "resolve ambiguity" |

### 8.4 Fail-Closed UX Principle

All failure, denial, and ambiguity states must reinforce the fail-closed posture:

| UX Principle | Implementation |
|--------------|----------------|
| **Default to Denial** | Uncertain states always display as blocked |
| **No Optimistic Messaging** | Never display "might work" or "try again" |
| **No Escalation to Execution** | Failures in simulation never prompt execution |
| **Clear Termination** | "Simulation terminated" is always explicit |

---

## 9. Audit and Evidence Visibility (Simulation-Only)

### 9.1 Audit Display for Users

Users may view audit evidence for their own simulations:

| Audit Element | User Visibility |
|---------------|-----------------|
| **Simulation Timestamp** | Visible |
| **Action Simulated** | Visible |
| **Outcome Computed** | Visible |
| **Gate Results (Summary)** | Visible ("All governance checks passed/failed") |
| **Detailed Gate Logs** | Not visible to users (operator-only) |
| **System Internals** | Not visible |

### 9.2 Audit Display for Operators

Operators see expanded audit information:

| Audit Element | Operator Visibility |
|---------------|---------------------|
| **Full Simulation Trace** | Visible |
| **All Gate Evaluations** | Visible with full context |
| **Boundary Crossing Attempts** | Visible (should always show "blocked") |
| **Actor Authorization Chain** | Visible |
| **Simulation Context Flags** | Visible and verified |

### 9.3 Evidence Presentation Constraints

| Constraint | Requirement |
|------------|-------------|
| **No Execution Claims** | Evidence must never state or imply execution occurred |
| **Simulation Watermark** | All evidence displays include "SIMULATION EVIDENCE" watermark |
| **Non-Exportable Warning** | Evidence export includes "NOT VALID AS EXECUTION EVIDENCE" header |
| **Temporal Limitation** | Evidence displays include "Valid for simulation review only — session-scoped" |

### 9.4 Evidence Isolation Enforcement

The UX must enforce evidence isolation by:

- Not providing copy-to-clipboard for evidence (prevents paste into external systems)
- Not providing export-to-PDF without simulation watermarks
- Not providing API access to simulation evidence (evidence is display-only)
- Not providing persistence controls (evidence is session-scoped)

---

## 10. Explicit Prohibitions

This document explicitly prohibits the following UX patterns and behaviors:

### 10.1 Execution-Implying Patterns

| Prohibition | Rationale |
|-------------|-----------|
| Green checkmarks for simulation completion | Green implies execution success |
| "Success" messaging for simulation outcomes | "Success" implies real-world effect |
| Progress indicators toward execution | Implies execution is the goal |
| "Confirm" buttons in simulation context | "Confirm" implies authorization |

### 10.2 Persistence Patterns

| Prohibition | Rationale |
|-------------|-----------|
| "Save simulation for later" | Persistence beyond session prohibited |
| "Add to favorites" for simulations | Implies reusability and persistence |
| "Share simulation" functionality | Could enable unauthorized distribution |
| Browser history manipulation for simulation URLs | Could enable replay |

### 10.3 Bypass Patterns

| Prohibition | Rationale |
|-------------|-----------|
| "Skip simulation, proceed to action" | Bypasses human review requirement |
| "Auto-execute if simulation passes" | Removes human from loop |
| "Batch simulate and execute" | Conflates simulation and execution |
| Single-click from simulation to execution | Insufficient separation |

### 10.4 Authority Patterns

| Prohibition | Rationale |
|-------------|-----------|
| Voice commands that authorize execution | Voice is never execution authority |
| "AI recommends proceeding" with execute button | AI may not authorize execution |
| Simulation results used as execution justification | Simulation ≠ authorization |
| "Pre-authorized based on simulation" messaging | Simulation cannot pre-authorize |

### 10.5 Retry and Recovery Patterns

| Prohibition | Rationale |
|-------------|-----------|
| "Retry simulation" with same parameters | No retry behavior in Phase H |
| "Resume interrupted simulation" | No state recovery in Phase H |
| "Rollback simulation" | Rollback implies prior execution |
| "Compensate for simulation error" | Compensation implies prior execution |

---

## 11. Out of Scope

The following are explicitly out of scope for this design document:

| Item | Rationale |
|------|-----------|
| **Visual Design Mockups** | UI implementation not authorized |
| **Component Library Specifications** | Implementation not authorized |
| **Accessibility Implementation** | Implementation not authorized |
| **Responsive Design Specifications** | Implementation not authorized |
| **Animation and Transition Definitions** | Implementation not authorized |
| **Internationalization/Localization** | Implementation not authorized |
| **Performance Metrics for UX** | Implementation not authorized |
| **A/B Testing Frameworks** | Implementation not authorized |
| **Analytics Integration** | Implementation not authorized |
| **Real Execution Surfaces** | Execution not authorized in Phase H |
| **Phase G Unblock Criteria** | Phase G remains blocked |
| **Production Deployment Plans** | Deployment not authorized |

---

## 12. Exit Criteria

Before any UX implementation may be considered (in a future phase, not authorized here), the following must be demonstrated:

### 12.1 Design Validation

| Criterion | Evidence Required |
|-----------|-------------------|
| All simulation surfaces clearly distinguished from execution | Design review confirming visual/language separation |
| No execution-implying patterns present | Pattern audit against Section 10 prohibitions |
| Fail-closed posture reflected in all failure states | Failure state design review |
| Evidence isolation enforced in all audit displays | Audit display design review |

### 12.2 Governance Alignment

| Criterion | Evidence Required |
|-----------|-------------------|
| Operator review surface meets governance requirements | Governance team sign-off |
| Patient-facing simulation meets transparency requirements | Patient advocate review |
| Clinician-facing simulation meets clinical workflow requirements | Clinical informatics review |
| All surfaces preserve human-in-the-loop | Workflow analysis |

### 12.3 H-01 Alignment

| Criterion | Evidence Required |
|-----------|-------------------|
| All UX surfaces respect H-01 architectural boundaries | Architecture review |
| Audit display aligns with H-01 evidence model | Evidence model alignment check |
| Failure presentation aligns with H-01 fail-closed semantics | Semantics alignment check |
| No UX path exists that could bypass H-01 constraints | Security review |

### 12.4 Documentation Completeness

| Criterion | Evidence Required |
|-----------|-------------------|
| This document reviewed and approved | Review record |
| No implementation authorization granted | Governance confirmation |
| Phase H scope boundaries respected | Scope audit |

---

## 13. Closing Governance Statement

**This document defines UX and operator review surface design for Phase H simulated execution.**

The following constraints are in force:

1. **Design-Only:** This document authorizes design understanding. It does not authorize implementation.
2. **No Execution:** No surface described in this document may trigger real execution.
3. **No Bypass:** No UX path may circumvent human review or governance gates.
4. **No Persistence:** No simulation state persists beyond session scope.
5. **No Authority:** No simulation outcome constitutes authorization for action.
6. **Fail-Closed:** All uncertain states resolve to denial and termination.

**This document authorizes understanding and governance design only. It does not authorize implementation or execution.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Authorization: NOT GRANTED*
