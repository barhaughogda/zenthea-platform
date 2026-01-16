# Phase AL-01: Booking Cognitive Flow and Mental Model Alignment

**Classification:** DESIGN-ONLY  
**Execution Status:** EXECUTION IS NOT ENABLED  
**Phase:** AL-01  
**Domain:** Booking Vertical — Cognitive Flow and Mental Model Alignment  

---

## 1. Status and Scope

This document governs the cognitive flow and mental model alignment requirements within the booking vertical.

**EXECUTION IS NOT ENABLED.**

This document is DESIGN-ONLY. It establishes binding governance for how humans MUST cognitively understand, perceive, and navigate booking interactions. It defines the mental model boundaries that all future design activities MUST respect.

This document MUST NOT be interpreted as authorization for execution, persistence, state mutation, or system-side commitment of any kind.

The scope is limited to cognitive and mental model governance. No operational behavior is authorized.

**EXECUTION IS NOT ENABLED.**

---

## 2. Purpose of This Document

The purpose of this document is to establish cognitive alignment as a prerequisite to any design activity that affects human understanding of booking interactions.

Cognitive alignment MUST precede execution readiness. Without explicit governance of how humans understand booking states, transitions, and actions, future execution phases risk introducing confusion, misinterpretation, or cognitive harm.

This document exists to ensure that humans MUST understand what they are doing, what state they are in, and what consequences may follow from their actions—before any execution is considered.

This document MUST be referenced in any future phase that introduces user-facing booking interactions, state transitions, or action affordances.

This document authorizes NOTHING operational. It constrains interpretation and design only.

**EXECUTION IS NOT ENABLED.**

---

## 3. Binding Authorities and Dependencies

This document is governed by and dependent upon:

- Phase AK Product Lock and all preceding governance constraints
- Phase AK-01 Product Surface Realignment Brief
- Phase AK-02 Booking-First Surface Deepening
- Phase AK-03 Booking Interaction Intent and Proposal Semantics
- Phase AK-04 Booking Confirmation Semantics
- Phase AK-05 Booking Change, Cancellation, and Reversal Semantics
- All applicable UI Governance and Interaction Rules

This document MUST NOT contradict any binding authority.

This document MUST be interpreted in the most restrictive manner consistent with its dependencies.

This document inherits the booking-first product orientation established in Phase AK-01 and deepened in Phase AK-02. All cognitive flow requirements are bound to the booking vertical as the sole canonical product vertical.

---

## 4. Definition of "Cognitive Flow" (IS / IS NOT)

### Cognitive Flow IS:

- The sequential and logical progression of human understanding through booking interactions
- The traceable path by which a human arrives at comprehension of their current state
- The conscious mental process by which a human distinguishes between intent, proposal, confirmation, change, cancellation, reversal, and abandonment
- The human experience of clarity regarding what action they are taking and what state results from that action
- The preservation of human agency through comprehensible interaction sequences

### Cognitive Flow IS NOT:

- User interface design, layout, or visual specification
- System-side workflow orchestration or process execution
- Automated sequencing of interactions without human initiation
- A mechanism for guiding humans toward particular outcomes
- A substitute for explicit human decision-making
- A pathway to execution readiness

Cognitive flow governs human understanding only. It does NOT govern system behavior, state transitions, or execution sequences.

**EXECUTION IS NOT ENABLED.**

---

## 5. Definition of "Mental Model Alignment" (IS / IS NOT)

### Mental Model Alignment IS:

- The correspondence between what a human believes they are doing and what the system represents
- The elimination of gaps between human expectation and system state representation
- The explicit verification that humans understand the semantic meaning of their actions
- The assurance that no action occurs without human comprehension of its meaning
- The preservation of cognitive integrity through accurate state representation

### Mental Model Alignment IS NOT:

- Implicit understanding derived from user behavior or navigation patterns
- Inferred comprehension based on time spent or interactions completed
- Assumed alignment based on user expertise, history, or demographic
- System-determined alignment without explicit human verification
- A state that can be achieved through passive observation of user actions

Mental model alignment MUST NOT be inferred. Mental model alignment MUST NOT be assumed. Mental model alignment MUST be explicitly established through design that ensures human comprehension.

Implicit or inferred understanding MUST NOT be treated as alignment. Only explicit design that guarantees comprehension satisfies alignment requirements.

**EXECUTION IS NOT ENABLED.**

---

## 6. Human Perspective Boundaries

A human MUST understand the following at each booking interaction boundary:

**At Intent Expression Boundary:**

- The human MUST understand that they are expressing intent, not committing to action
- The human MUST understand that intent expression does not trigger execution
- The human MUST understand that intent expression is exploratory and non-binding

**At Proposal Boundary:**

- The human MUST understand what a proposal contains
- The human MUST understand that a proposal is under consideration, not confirmed
- The human MUST understand that they MAY modify or abandon the proposal without consequence

**At Confirmation Boundary:**

- The human MUST understand that confirmation is a cognitive declaration, not execution
- The human MUST understand what they are confirming
- The human MUST understand that confirmation does not mutate canonical system state

**At Change Boundary:**

- The human MUST understand that they are modifying a proposal
- The human MUST understand that change does not trigger execution
- The human MUST understand that change is reversible

**At Cancellation Boundary:**

- The human MUST understand that they are withdrawing a proposal from consideration
- The human MUST understand that cancellation does not trigger execution or deletion
- The human MUST understand that cancellation is reversible

**At Reversal Boundary:**

- The human MUST understand that they are returning to a prior state
- The human MUST understand what prior state they are returning to
- The human MUST understand that reversal does not trigger execution

**At Abandonment Boundary:**

- The human MUST understand that they are permanently ceasing consideration
- The human MUST understand the irreversible nature of abandonment
- The human MUST understand that abandonment does not trigger execution

**EXECUTION IS NOT ENABLED.**

---

## 7. Cognitive Distinction Between Intent States

Humans MUST cognitively distinguish between the following intent states. These states MUST NOT be conflated, collapsed, or blurred in human perception.

**Propose:**

- Propose MUST be understood as the creation of a candidate for consideration
- Propose MUST NOT be understood as commitment, confirmation, or execution
- Propose MUST be perceived as fully reversible and non-binding

**Change:**

- Change MUST be understood as modification of an existing proposal
- Change MUST NOT be understood as cancellation or abandonment
- Change MUST be perceived as maintaining the proposal under active consideration

**Cancel:**

- Cancel MUST be understood as withdrawal of a proposal from active consideration
- Cancel MUST NOT be understood as execution termination or system-side deletion
- Cancel MUST be perceived as reversible unless abandonment is explicitly declared

**Reverse:**

- Reverse MUST be understood as returning to a prior proposal state
- Reverse MUST NOT be understood as execution rollback or system-side restoration
- Reverse MUST be perceived as a human-declared return to previous consideration

**Abandon:**

- Abandon MUST be understood as permanent cessation of consideration
- Abandon MUST NOT be understood as execution or system-side deletion
- Abandon MUST be perceived as the only irreversible intent state

**Confirm:**

- Confirm MUST be understood as a human-declared acknowledgment of proposal content
- Confirm MUST NOT be understood as execution authorization
- Confirm MUST be perceived as distinct from and not adjacent to execution

The cognitive boundaries between these states are absolute. Design activities MUST preserve these distinctions in human perception.

**EXECUTION IS NOT ENABLED.**

---

## 8. Non-Equivalence Rules

The following concepts MUST NOT feel equivalent to users. Design activities MUST ensure cognitive separation between these pairs.

**Propose MUST NOT feel equivalent to Confirm.**

A human who proposes MUST NOT believe they have confirmed. The cognitive experience of proposing MUST be distinct from the cognitive experience of confirming.

**Confirm MUST NOT feel equivalent to Execute.**

A human who confirms MUST NOT believe execution has occurred. The cognitive experience of confirming MUST be distinct from any perception of execution.

**Cancel MUST NOT feel equivalent to Abandon.**

A human who cancels MUST NOT believe they have permanently abandoned. The cognitive experience of cancelling MUST include awareness of reversibility.

**Abandon MUST NOT feel equivalent to Delete.**

A human who abandons MUST NOT believe system-side deletion has occurred. The cognitive experience of abandoning MUST be distinct from any perception of state mutation.

**Change MUST NOT feel equivalent to Cancel.**

A human who changes MUST NOT believe they have cancelled. The cognitive experience of changing MUST include awareness that the proposal remains under consideration.

**Reverse MUST NOT feel equivalent to Undo Execution.**

A human who reverses MUST NOT believe they are undoing executed actions. The cognitive experience of reversing MUST be distinct from any perception of execution rollback.

**Intent MUST NOT feel equivalent to Commitment.**

A human who expresses intent MUST NOT believe they have committed. The cognitive experience of intent expression MUST preserve full freedom of subsequent action.

Violations of these non-equivalence rules MUST be treated as cognitive alignment failures.

**EXECUTION IS NOT ENABLED.**

---

## 9. UI Cognitive Responsibility (Non-Visual)

The user interface bears responsibility for preserving cognitive clarity. This section defines that responsibility without prescribing visual design.

**State Representation Responsibility:**

The UI MUST represent the current state in a manner that humans understand without ambiguity. Humans MUST know whether they are in intent, proposal, confirmation, change, cancellation, reversal, or abandonment state.

**Transition Clarity Responsibility:**

The UI MUST make state transitions cognitively apparent. Humans MUST perceive when they transition from one state to another. Transitions MUST NOT occur without human awareness.

**Action-State Correspondence Responsibility:**

The UI MUST ensure that human actions correspond to human-perceived state changes. Actions MUST NOT produce state changes that humans do not perceive or expect.

**Non-Execution Clarity Responsibility:**

The UI MUST communicate that no execution occurs within current-phase semantics. Humans MUST NOT perceive execution where none exists. The UI MUST NOT create perception of execution readiness.

**Reversibility Communication Responsibility:**

The UI MUST communicate reversibility status. Humans MUST know which states are reversible and which are not. Irreversibility MUST NOT be hidden or obscured.

These responsibilities define cognitive obligations without specifying implementation details.

**EXECUTION IS NOT ENABLED.**

---

## 10. Assistant Participation Constraints

The assistant MUST NOT frame interactions in ways that distort cognitive flow or mental model alignment.

**Permitted Assistant Activities:**

The assistant MAY describe states, transitions, and actions in accurate terms.

The assistant MAY clarify the meaning of intent, proposal, confirmation, change, cancellation, reversal, and abandonment.

The assistant MAY answer questions about what a human has done or what state they are in.

The assistant MAY correct human misunderstanding when misalignment is detected.

**Prohibited Assistant Activities:**

The assistant MUST NOT frame proposals as commitments.

The assistant MUST NOT frame confirmations as executions.

The assistant MUST NOT frame intent expression as decision finalization.

The assistant MUST NOT create urgency, pressure, or artificial deadlines that distort cognitive flow.

The assistant MUST NOT suggest that actions have greater consequence than they do.

The assistant MUST NOT minimize the significance of abandonment.

The assistant MUST NOT guide humans toward particular outcomes through cognitive framing.

The assistant MUST NOT imply execution readiness where none exists.

**EXECUTION IS NOT ENABLED.**

---

## 11. Prohibited Cognitive Patterns

The following cognitive patterns are explicitly prohibited. Design activities MUST NOT introduce these patterns.

**Dark Patterns:**

Design MUST NOT employ dark patterns that exploit cognitive bias to influence human decisions.

Design MUST NOT use confirmshaming, trick questions, hidden costs, forced continuity, friend spam, roach motel, privacy zuckering, or any recognized dark pattern.

**Pressure Patterns:**

Design MUST NOT create artificial urgency that distorts cognitive flow.

Design MUST NOT impose false scarcity that pressures human decision-making.

Design MUST NOT use social proof manipulation to influence cognitive alignment.

**Implied Finality Patterns:**

Design MUST NOT imply finality where reversibility exists.

Design MUST NOT present reversible states as irreversible.

Design MUST NOT frame proposals or confirmations as final acts.

**Execution-Adjacent Framing:**

Design MUST NOT position non-executing interactions adjacent to execution perception.

Design MUST NOT use language, imagery, or affordance patterns that suggest execution is occurring or imminent.

Design MUST NOT create cognitive proximity between current-phase semantics and execution.

**Ambiguity Patterns:**

Design MUST NOT introduce ambiguity between distinct intent states.

Design MUST NOT blur the cognitive boundaries defined in this document.

Design MUST NOT allow multiple reasonable interpretations of current state.

Violations of prohibited patterns MUST be treated as governance violations.

**EXECUTION IS NOT ENABLED.**

---

## 12. Drift Prevention Rules

Cognitive drift toward execution MUST be actively prevented. The following rules are binding.

**No Incremental Execution Proximity:**

Design activities MUST NOT incrementally move cognitive framing closer to execution perception. Each design iteration MUST maintain the same cognitive distance from execution as defined in this phase.

**No Semantic Erosion:**

The semantic distinctions between intent states MUST NOT erode over time. Future design phases MUST NOT weaken the cognitive boundaries established herein.

**No Implicit Execution Readiness:**

Design activities MUST NOT create implicit pathways to execution readiness perception. Humans MUST NOT progressively perceive themselves as closer to execution through accumulated interactions.

**No Normalization of Execution Language:**

Design activities MUST NOT normalize execution language in non-executing contexts. Terms associated with execution MUST remain absent from cognitive framing.

**Audit Requirement:**

All design activities affecting cognitive flow MUST be auditable against this document. Reviewers MUST verify that cognitive alignment is preserved and that drift has not occurred.

**EXECUTION IS NOT ENABLED.**

---

## 13. Relationship to Future Phases

This document governs cognitive flow and mental model alignment for the current phase and all subsequent phases until explicitly superseded.

Future phases MAY introduce execution semantics. When such phases are authorized:

- This document MUST be referenced as the definitional authority for cognitive flow and mental model alignment
- Cognitive clarity MUST be preserved through the transition to execution-enabled phases
- The distinction between confirmation and execution MUST be maintained in human perception even when execution becomes possible
- No future phase MAY collapse the cognitive boundaries established herein
- Any execution enablement MUST be preceded by explicit cognitive alignment verification

This document establishes the permanent cognitive framework for booking interactions.

This framework MUST NOT be eroded, blurred, or collapsed in any future phase.

**EXECUTION IS NOT ENABLED.**

---

## 14. Closing Governance Statement

This document authorizes NOTHING.

This document enables NOTHING operational.

This document permits NOTHING to be executed, persisted, mutated, or committed.

**EXECUTION IS NOT ENABLED.**

This document exists solely to define cognitive flow and mental model alignment requirements within the booking vertical. It establishes the cognitive prerequisites that all future design activities MUST satisfy.

Any interpretation that collapses cognitive states into execution perception is a governance violation.

Any interpretation that treats cognitive alignment as execution preparation is a governance violation.

Any interpretation that derives execution authority from this document is a governance violation.

Any design activity that introduces prohibited cognitive patterns is a governance violation.

Any design activity that causes cognitive drift toward execution is a governance violation.

Cognitive flow and mental model alignment govern human understanding only. They do NOT enable, prepare, justify, or authorize execution of any kind.

**EXECUTION IS NOT ENABLED.**

This document authorizes NOTHING.

---

*End of Document*
