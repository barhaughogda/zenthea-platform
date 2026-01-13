# Phase R-01: Demo Canonical Scenarios

**Status:** Design-Only | Demo-Only | Execution Blocked  
**Phase:** R-01  
**Classification:** Governance Artifact  
**Audience:** Investors, Regulators, Clinical Safety Reviewers, Internal Alignment

---

## 1. Purpose of Canonical Scenarios

This document defines the authoritative, fixed demo narratives for the Zenthea non-executing assistant. These scenarios exist to demonstrate system intelligence while maintaining explicit execution blocking at every boundary.

### Why Demos Must Be Fixed, Repeatable, and Inspectable

- **Regulatory safety:** Regulators require predictable, documented demonstration paths that can be audited and reproduced.
- **Clinical trust:** Healthcare stakeholders must observe identical behavior across repeated demonstrations to verify safety posture.
- **Investor clarity:** Fixed scenarios prevent misrepresentation of system capabilities and ensure consistent communication of the execution boundary.
- **Internal alignment:** All team members must demonstrate the same behaviors to avoid capability drift or unauthorized claims.

### Why Improvisation Is Prohibited

Improvised demonstrations introduce:
- Unpredictable system states that cannot be audited
- Risk of demonstrating behaviors that do not exist
- Potential for implicit execution claims
- Inconsistent messaging about system boundaries

**Improvisation is explicitly prohibited in all Phase R demonstrations.**

### Why These Scenarios Are Safety Artifacts

These canonical scenarios are not sales scripts. They are:
- **Safety artifacts** that define the permissible demonstration surface
- **Governance documents** that bound what may be shown
- **Audit evidence** that demonstrates system posture to regulators
- **Boundary markers** that make execution blocking visible and verifiable

---

## 2. Demo Posture and Global Constraints

All Phase R demonstrations operate under the following immutable constraints:

| Constraint | Enforcement |
|------------|-------------|
| **Read-only** | No data modification occurs during demonstration |
| **No execution** | No actions are performed on any system |
| **No automation** | No background processes initiate any activity |
| **No background activity** | System is inert except for explicit user interaction |
| **No persistence** | Demo state does not persist beyond session |
| **No live side effects** | No external systems are contacted or modified |
| **Explicit demo labeling** | All screens display visible "DEMO MODE" indicators |

### Execution Remains Blocked

At no point during any Phase R demonstration does the system execute any action. The assistant provides intelligence, context, and readiness previews. **Execution remains blocked by architectural design.**

---

## 3. Canonical Scenario Set (Overview)

Phase R defines exactly three canonical scenarios:

| # | Scenario | Actor | Purpose |
|---|----------|-------|---------|
| 1 | Patient-Initiated Inquiry | Patient | Demonstrate read-only intelligence |
| 2 | Clinician Review and Confirmation Preview | Clinician | Demonstrate human authority surface |
| 3 | Operator / Governance Inspection | Operator / Compliance | Demonstrate audit and policy visibility |

**No additional scenarios are permitted in Phase R.**

Any demonstration request outside these three scenarios must be escalated to governance review and is not authorized under this document.

---

## 4. Scenario 1: Patient Inquiry (Read-Only Intelligence)

### Actor
Patient (authenticated, scope-gated session)

### Entry Point
Explicit session start via patient portal with visible "DEMO MODE" indicator.

### Example Intent
"When is my next appointment with Dr. Martinez?"

### What the Assistant Shows

The assistant demonstrates intelligence without execution by providing:

#### Context Grounding
- Patient identity confirmation (read-only)
- Current session scope display
- Data sources consulted (listed, not accessed live)

#### Timeline Relevance
- Relevant upcoming appointments surfaced from static demo data
- Historical context displayed where appropriate
- Temporal relationships explained

#### "What Stands Out"
- Key observations the assistant identifies
- Potential concerns or notes requiring attention
- Relevant clinical context (read-only display)

#### Confidence and Uncertainty
- Explicit confidence indicators for all surfaced information
- Clear marking of uncertain or incomplete data
- Transparent acknowledgment of data boundaries

### Execution Block Messaging

The assistant explicitly displays:

> **This assistant does not take actions.**  
> Any changes to your appointments require human confirmation through authorized clinical staff.  
> No action has been taken during this session.

### Clear Statement

**No action is taken.** The patient observes intelligence. The patient does not observe execution. The system remains inert.

---

## 5. Scenario 2: Clinician Review (Human Authority Surface)

### Actor
Clinician (authenticated, role-verified)

### Review of Assistant Output
The clinician reviews the assistant's patient-facing output, including:
- Summary of patient inquiry
- Context the assistant surfaced
- Confidence and uncertainty markers
- Any flagged concerns

### Action Readiness Framing

The assistant presents potential next steps in Action Readiness format:
- What action COULD be taken (hypothetical)
- What prerequisites would be required
- What approvals would be necessary
- **Current status: NOT READY (execution blocked)**

### Human Confirmation Preview (WHO / WHAT / WHY)

The clinician observes the Human Confirmation Preview panel:

| Element | Display |
|---------|---------|
| **WHO** | Identifies the human who would authorize (role, identity) |
| **WHAT** | Describes the specific action under consideration |
| **WHY** | Explains the clinical or operational rationale |

This preview exists for inspection only. **No confirmation is solicited or accepted.**

### Execution Plan Preview

The Execution Plan Preview shows:
- Step-by-step breakdown of what WOULD occur
- Systems that WOULD be affected
- Data that WOULD be modified
- Audit trail that WOULD be generated

**All items are displayed in future conditional tense. Nothing executes.**

### Explicit STOP Before Execution

The interface displays a prominent STOP indicator:

> **EXECUTION BLOCKED**  
> This system does not execute actions.  
> Clinician approval in this demo does not trigger any action.  
> This preview exists for visibility only.

### Statement on Clinician Approval

**Clinician approval does NOT execute anything.**  
In Phase R, the approval surface exists only to demonstrate where human authority would be exercised. The approval button is disabled or absent. Clicking any approval-like element displays the execution block message.

---

## 6. Scenario 3: Operator / Governance Inspection

### Actor
Operator or Compliance Officer (administrative role)

### Policy Decision Inspector

The operator reviews the Policy Decision Inspector, which displays:
- Policy rules evaluated for the current context
- Decision outcomes (PERMIT / DENY / BLOCK)
- Rule provenance and justification
- Override history (empty in demo - no overrides possible)

### Readiness Gate Visibility

The Execution Readiness Gate panel shows:
- All prerequisite conditions for execution
- Current status of each condition
- **GATE STATUS: CLOSED (execution blocked)**
- Reason: Phase R architectural constraint

### Audit Preview

The Audit Preview panel displays:
- What audit records WOULD be generated
- Retention policies that WOULD apply
- Access controls that WOULD govern audit data
- **No actual audit records are created during demo**

### Dry-Run Preview Reference (Q-03)

Per Phase Q-03 (Limited Execution Dry-Run Preview), the operator can observe:
- Simulated execution path (no actual execution)
- Expected outcomes (hypothetical)
- Side effect inventory (what WOULD change)
- Rollback considerations (theoretical)

**The Dry-Run Preview demonstrates planning visibility without performing any action.**

### Demonstration of Fail-Closed Posture

The operator observes explicit fail-closed behavior:
- Any ambiguous condition results in BLOCK
- Missing prerequisites result in BLOCK
- Policy uncertainty results in BLOCK
- System defaults to non-execution in all edge cases

---

## 7. Execution Boundary Demonstration

Every canonical scenario explicitly demonstrates the execution boundary through the following mechanisms:

### Where Execution WOULD Occur

The interface marks the exact point where execution would begin:
- Visual boundary line in workflow diagrams
- "Execution would begin here" label
- List of systems that would be engaged
- Data that would be modified

### Why It Does NOT Occur

Clear explanation provided to audience:
- Phase R architectural constraint
- Design-only governance posture
- Explicit blocking at control plane level
- No execution path is enabled

### Which Phase Blocks It

Display indicates:
> **Blocked by:** Phase R architectural constraint  
> **Execution enabled in:** Phase S (future, not authorized)  
> **Current authorization:** Read-only intelligence demonstration

### How This Is Visible to the Human

The execution boundary is visible through:
- DEMO MODE indicators on all screens
- EXECUTION BLOCKED banners at decision points
- Disabled or absent action buttons
- Explicit messaging in assistant responses
- Audit panel showing no execution records

---

## 8. Prohibited Demo Behaviors

The following behaviors are explicitly prohibited during any Phase R demonstration:

| Prohibited Behavior | Reason |
|--------------------|--------|
| Clicking anything that implies action | May suggest execution capability |
| Auto-advancing flows | Removes human control visibility |
| Hidden state changes | Violates transparency requirements |
| Live system references | May imply production connectivity |
| "Pretend execution" | Misrepresents system posture |
| Improvised explanations | May introduce unauthorized claims |
| Promises of future capability | Outside scope of current authorization |
| Performance benchmarks | Not validated, may mislead |
| Scalability claims | Not demonstrated in demo context |
| Comparison to executing systems | May minimize execution boundary importance |

### Enforcement

Any demo participant who observes prohibited behavior must:
1. Immediately pause the demonstration
2. Correct the record with audience
3. Document the deviation
4. Report to governance review

---

## 9. Demo Success Criteria

A Phase R demonstration is successful if and only if the following conditions are met:

### Audience Understands Intelligence ≠ Execution

At demonstration conclusion, audience members can articulate:
- The system provides contextual intelligence
- The system does not perform actions
- Intelligence and execution are architecturally separated

### Audience Can Point to the Execution Boundary

Audience members can identify:
- Where in the workflow execution would begin
- What visual indicators mark this boundary
- Why the boundary exists
- How the boundary is enforced

### Audience Understands Who Would Be Responsible

Audience members can state:
- Human authority is required for any execution
- The specific role that would authorize action
- The visibility provided to that human
- The absence of autonomous execution

### Audience Sees That Nothing Happened

Audience members confirm:
- No data was modified
- No actions were performed
- No external systems were contacted
- The system is in the same state as when the demo began

---

## 10. Out of Scope

The following are explicitly excluded from Phase R demonstrations:

| Exclusion | Rationale |
|-----------|-----------|
| **Execution** | Blocked by architectural design |
| **Integrations** | No live system connectivity in demo |
| **Performance claims** | Not validated in demo context |
| **Scalability claims** | Not demonstrated at scale |
| **AI autonomy** | System is explicitly non-autonomous |
| **Future roadmap promises** | Outside authorization scope |
| **Competitive comparisons** | May misrepresent boundaries |
| **Pricing or commercial terms** | Not a governance concern |
| **Implementation timelines** | Not authorized for disclosure |

### Handling Out-of-Scope Questions

When audience members ask about excluded topics:
1. Acknowledge the question
2. State that the topic is outside Phase R scope
3. Offer to document the question for future consideration
4. Return to canonical scenario content

**Do not improvise answers to out-of-scope questions.**

---

## 11. Closing Governance Statement

This document, Phase R-01: Demo Canonical Scenarios, serves as the authoritative governance artifact for Zenthea platform demonstrations.

### Authorization Scope

This document authorizes:
- **Demo understanding only**
- Fixed, repeatable demonstration of read-only intelligence
- Visibility into human authority surfaces
- Inspection of policy and audit mechanisms

### Explicit Non-Authorization

This document does NOT authorize:
- Implementation of any described functionality
- Execution of any action by the system
- Automation of any workflow
- Deployment to any environment
- Integration with any external system
- Modification of any data

### Execution Posture

**Execution remains blocked by default.**

No language in this document should be construed as enabling, permitting, or preparing for execution. The Zenthea platform remains a non-executing assistant. All execution capability is deferred to future phases that are not authorized by this document.

### Governance Authority

Changes to this document require:
- Governance review and approval
- Documentation of change rationale
- Version control with audit trail
- Notification to all stakeholders

---

**Document End**

*Phase R-01 | Design-Only | Demo-Only | Execution Blocked*
