# L-03 — Demo Assembly & Readiness Definition

## 1. Purpose and Scope
This document serves as the design definition for the Zenthea Phase L demo assembly and readiness framework. It establishes the structural, narrative, and operational requirements for a non-executing demonstration environment.

**Strict Governance Posture:**
- This is a **design-only** artifact.
- It is **explicitly non-executing**.
- It **does not authorize** implementation, execution, automation, or deployment of any software or services.
- Its purpose is to define the "what" and "how" of the demo narrative, not to build the "how" of the software.

## 2. Relationship to Prior Phase L Artifacts
This document bridges the gap between the UI design constraints and the narrative flows established earlier in Phase L:
- **Trace to L-01 (UI Constraints):** Adheres to the non-executing assistant UI implementation plan, ensuring all demo surfaces respect the execution block.
- **Trace to L-02 (Interaction Flows):** Choreographs the specific demo moments identified in the interaction flows into a cohesive assembly.
- **Reaffirmation:** The execution block defined in L-01 remains absolute; no part of the demo assembly defined herein shall bypass or imply the bypass of these controls.

## 3. Definition of “Demo Assembly”
"Demo Assembly" refers to the specific configuration of static assets, scripted interactions, and simulated views used to communicate the Zenthea value proposition.

- **Demo ≠ Product:** The demo is a narrative-controlled environment designed for walkthroughs and stakeholder alignment.
- **Narrative Control:** Every state change in the demo is driven by a scripted sequence or manual operator action, not by autonomous system logic.

## 4. Demo Surface Inventory
The demo encompasses three primary surfaces, each with strictly defined boundaries:

### 4.1 Patient Surface (Mobile-First Web)
- **May Show:** Static profile data, simulated message history, non-functional "educational" cards, and the "Ask Zenthea" chat interface.
- **May Not Show:** Live medical records, active prescription buttons, or "Buy/Book Now" buttons that imply backend execution.

### 4.2 Clinician Surface (Desktop Web)
- **May Show:** Simulated patient queues, static clinical summaries, and read-only AI-generated insights.
- **May Not Show:** "Approve" buttons that trigger real EHR writes, live patient monitoring, or real-time diagnostic tools.

### 4.3 Operator Surface (Admin/Command Center)
- **May Show:** The "Safety Loop" view—demonstrating how an operator *would* oversee the system.
- **May Not Show:** Active controls that mutate live database records or bypass safety gates.

## 5. Demo Flow Choreography
The demo proceeds through a series of "Moments," sequenced to show the human-in-the-loop journey:

1.  **Opening:** Narrative setup of the patient persona and clinical context.
2.  **Interaction:** The operator (acting as the patient) enters a pre-scripted query into the Patient Surface.
3.  **Simulation:** The UI displays a "simulated" assistant response, including visible "Thought Process" and "Safety Verification" indicators.
4.  **Handoff:** The demo transitions to the Clinician Surface to show how the interaction is presented to the provider.
5.  **Closing:** Summary of the non-executing outcome (e.g., "Information gathered for clinical review").

## 6. Operator Responsibilities
The demo is manually driven by a designated Operator.

- **Manual Control:** All transitions between screens and states are triggered by the Operator.
- **Scripted Inputs:** The Operator must only use inputs defined in the demo script to ensure the narrative remains within the "non-executing" bounds.
- **Prohibition on Mutation:** The Operator is strictly forbidden from attempting to mutate any system state that would result in side effects beyond the local demo environment.

## 7. Simulation vs Reality Boundaries
| Element | Simulation Method | Reality Status |
| :--- | :--- | :--- |
| **AI Reasoning** | Static Markdown / Pre-baked JSON | **MOCKED** |
| **Database Records** | Local state / Static assets | **STATIC** |
| **API Calls** | No-op / Local JSON file fetch | **SIMULATED** |
| **Patient Safety Gate** | Visual indicator only | **NON-EXISTENT** |
| **System Mutation** | UI state change only | **FORBIDDEN** |

## 8. Failure & Refusal Demonstration Strategy
Zenthea demos prioritize the demonstration of system *refusal* to build trust.

- **Intentional Refusal:** Every demo must include at least one scenario where the assistant correctly refuses to provide medical advice or perform an unauthorized action.
- **Visual Feedback:** Refusals are highlighted with clear UI indicators explaining *why* the system stopped (e.g., "Safety Boundary Encountered").
- **Narrative Value:** Refusal moments are treated as first-class events to demonstrate the robustness of the governance model.

## 9. Safety & Trust Signals in Demo
All demo surfaces must include mandatory visible indicators:
- **"DEMO MODE":** Persistent watermark on all screens.
- **"NON-EXECUTING":** Clear status indicator in the assistant header.
- **Consent Status:** Static representation of the patient's current consent levels.
- **Session ID:** A mock session identifier for auditability demonstration.

## 10. Explicit Demo Prohibitions
To maintain governance integrity, the following are strictly prohibited:
- **No Execution:** No real actions (booking, billing, prescribing) shall occur.
- **No Automation:** No background cron jobs, webhooks, or auto-responders.
- **No Hidden Behavior:** No "behind the scenes" processing that is not visible to the operator.
- **No Future Promises:** No claims that the demo represents currently executing production software.
- **No Implied Authority:** No UI elements that suggest the AI has autonomous authority over clinical or financial decisions.

## 11. Demo Readiness Criteria
A demo assembly is considered "Ready" only when:
- **Narrative Completeness:** The script covers all intended "Moments" and safety stops.
- **Governance Sign-off:** A review ensures the assembly complies with Phase L non-executing rules.
- **Operator Preparedness:** The designated operator has completed a walkthrough and understands the boundaries.
- **Asset Integrity:** All static screens and mock data are verified to contain no PII or unauthorized "future" features.

## 12. Out of Scope
The following activities are explicitly **not** authorized by this document:
- Creation of React components or frontend code.
- Implementation of backend API routes or database schemas.
- Deployment of any infrastructure or containers.
- Integration with external 3rd party services (EHRs, Billing).

## 13. Exit Criteria
Completion of this document allows for:
- Moving to **L-04 — Demo Environment Configuration** (design-only).
- Initiating future implementation planning sessions under a new governance phase.

## 14. Closing Governance Statement
This document authorizes understanding and design alignment only. It **does not authorize** implementation, execution, automation, or deployment of the demo or any related software components. Any transition from design to execution must be governed by a separate, authorized execution phase.
