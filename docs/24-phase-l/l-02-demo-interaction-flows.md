# L-02: Demo Interaction Flows – Zenthea Non-Executing Assistant

## 1. Purpose and Scope
This document defines the end-to-end demo interaction flows for the Zenthea non-executing assistant UI. It serves as the narrative layer for Phase L, translating the implementation plan in L-01 into human-experienced scenarios. 

These flows are designed for demonstration purposes to show the assistant's behavior, posture, and limitations. They are explicitly non-executing: Zenthea facilitates information gathering and draft creation but never performs actions, makes updates, or automates workflows. These are demo-grade narratives, not production specifications.

## 2. Relationship to Prior Phases
- **Trace to Phase J (Conversational Core):** These flows utilize the runtime shell, memory models, and conversational discipline established in Phase J to ensure consistent and bounded interactions.
- **Trace to Phase K (Safety & Surfaces):** The interaction flows respect the capability gating, escalation paths, and product surfaces (Ambient, Sidebar, Dedicated) defined in Phase K.
- **Trace to Phase L-01 (UI Constraints):** Every interaction described here adheres to the strict UI constraints of L-01, specifically the prohibition on action-oriented UI elements (e.g., "Submit", "Send", "Book").

## 3. Demo Principles
- **Clarity over Cleverness:** The assistant's role must be immediately obvious. It is a listener and a drafter, not an agent.
- **Refusals are Value:** Demonstrating what Zenthea *cannot* do is as important as showing what it can do. Refusals build trust by showing boundary enforcement.
- **No Illusion of Action:** The UI and conversation must never imply that Zenthea is taking an action on the user's behalf.
- **Human Authority Always Explicit:** Every significant output (e.g., a draft) must be explicitly tied to a human review or approval step outside of the Zenthea assistant.

## 4. Canonical Demo Roles
- **Patient:** The primary subject of care. Interacts with Zenthea to provide information, ask questions, and review drafts of their own requests.
- **Clinician:** The primary user of Zenthea's clinical drafting capabilities. Uses the assistant to capture encounter notes and prepare clinical documentation drafts.
- **Operator / Governance:** The oversight role. Observes the assistant's performance, safety signals, and aggregate interaction data to ensure compliance and safety.
- **Role Boundaries:** Interactions are strictly partitioned by role-based access. A patient cannot see clinician drafts, and a clinician cannot see governance signals during a patient interaction.

## 5. Demo Session Lifecycle (High-Level)
1. **Session Start:** User initiates interaction (e.g., enters the portal, starts a voice session).
2. **Identity Binding:** Zenthea confirms the user's identity and context (e.g., "I am here to help you, [Name], with your visit today.").
3. **Consent Moment:** Explicit user consent for session recording and assistant participation is captured and displayed.
4. **Interaction Loop:** The core conversational exchange (voice or text). Zenthea listens, clarifies, and drafts.
5. **Session End:** User or system ends the session.
6. **No Background Continuation:** Once the session ends, Zenthea's active listening and drafting cease. No background processing or follow-up occurs.

## 6. Patient Demo Flow
- **Opening Moment:** Patient opens the portal. Zenthea appears in a non-intrusive sidebar, stating its limited role as an information-gathering assistant.
- **Typical Requests:** "I need to update my address," or "How do I prepare for my surgery?"
- **Draft Creation:** Zenthea responds: "I can draft that address update for you to review before you send it to the clinic," or "I've pulled a draft of the preparation instructions for you to review."
- **Explicit Refusals:** If a patient asks Zenthea to "Book my appointment," Zenthea responds: "I cannot book appointments. I can draft your preference for a Tuesday morning, which you can then use when you call the scheduling desk."
- **Session Summary:** At the end, Zenthea provides a summary of the drafts created and the next steps for the patient to take themselves.
- **Value without Execution:** Value is shown through the reduction of "blank page" effort for the patient, while maintaining the patient's role as the sole executor of actions.

## 7. Clinician Demo Flow
- **Context Intake:** Clinician starts an ambient listening session during a patient encounter.
- **Draft Review:** After the encounter, the clinician reviews a "Draft Encounter Note" in the dedicated surface. 
- **Clarification Interactions:** Clinician asks, "Did we discuss the medication dosage?" Zenthea points to the specific part of the transcript or draft where it was mentioned.
- **Refusal Scenarios:** Clinician says, "Send this to the pharmacy." Zenthea responds: "I cannot send prescriptions. The draft is ready for you to copy into the EMR for your final review and signature."
- **Escalation Awareness:** If the clinician's request implies a safety risk, Zenthea highlights the relevant safety gating and refuses to draft until the clinician provides more context.
- **Authority Preservation:** The UI ensures the clinician knows they must manually move the draft into the system of record.

## 8. Operator / Governance Demo Flow
- **Observability Surface:** Operators view a dashboard showing active session counts, consent rates, and refusal events.
- **Aggregate Signals:** Demonstrating trends in refusal types (e.g., "15% of sessions involved a booking request refusal").
- **Visibility Limits:** Operators see high-level metadata and safety signals but do not have access to individual session transcripts or draft content without explicit authorization.
- **Safety Posture Demonstration:** Showing how real-time safety gates (from Phase K) flag potential policy violations or boundary crossings.

## 9. Voice + Text Parity in Demo
- **Same Flows:** Whether interacting via voice or text, the interaction steps and logic remain identical.
- **Same Refusals:** Voice commands like "Hey Zenthea, book my appointment" meet the same refusal response as the text-based equivalent.
- **Same Authority Limits:** Voice interactions never bypass the need for human review of the resulting drafts.
- **Voice as Interface Only:** Voice is treated strictly as a modality for input and output, not as a shortcut to execution.

## 10. Refusal Moments as First-Class Demo Events
- **What Zenthea Refuses:** Any request for execution (sending, booking, updating), clinical diagnosis, or medical advice.
- **How it Explains Why:** "To ensure accuracy and safety, I am designed to assist with drafting and information only. A human staff member must perform this action."
- **How Alternatives are Offered:** "I cannot update your record, but I have drafted the update for you to present to the front desk."
- **Building Trust:** By being predictable and transparent about its limitations, Zenthea avoids the "hallucination of agency" that leads to user error.

## 11. “What Zenthea Does NOT Do” Demo Moments
- **No Sending:** Zenthea never clicks "Send" on an email or message.
- **No Booking:** Zenthea never schedules an event in a calendar.
- **No Updating:** Zenthea never writes directly to a database or record.
- **No Follow-ups:** Zenthea does not "reach out later" or monitor background state.
- **Explicitly Shown:** Demos will include specific "Negative Cases" where these actions are requested and clearly refused.

## 12. Demo Safety & Trust Signals
- **Always Visible:** A persistent indicator of "Drafting Mode Only - No Execution".
- **Session State:** Clear "Active / Inactive" status for the assistant.
- **Consent State:** Visual confirmation that consent is active.
- **Voice Capture State:** High-visibility indicator when the microphone is active.
- **Execution-Block Clarity:** Any UI element that looks like a button is clearly labeled for "Copy" or "View Draft," never for "Execute."

## 13. Explicit Prohibitions
- **No Execution:** No triggering of external APIs for state change.
- **No Automation:** No background tasks or scheduled jobs.
- **No Background Behavior:** No listening or processing when a session is not active.
- **No Persuasive Framing:** No language that encourages a user to trust the assistant over their own judgment.
- **No Implied Authority:** No "I have confirmed this" or "This is correct" statements.

## 14. Out of Scope
- **UI Design:** Detailed mockups, colors, or typography.
- **Screens:** Specific page layouts or wireframes.
- **Code:** No frontend or backend implementation.
- **Mobile:** Mobile-specific interactions or responsive designs.
- **Backend:** Integration logic or data persistence details.
- **Performance:** Latency, scaling, or throughput requirements.

## 15. Exit Criteria
- **L-03 Readiness:** Successful review of these flows by stakeholders to confirm they meet non-executing requirements.
- **Demo Readiness:** All canonical roles and flows are clearly defined and narratively consistent.
- **Governance Alignment:** Confirmation from legal and compliance that the flows adhere to safety and non-execution posture.

## 16. Closing Governance Statement
“This document authorizes understanding and design alignment only. It does not authorize implementation, execution, automation, or deployment.”
