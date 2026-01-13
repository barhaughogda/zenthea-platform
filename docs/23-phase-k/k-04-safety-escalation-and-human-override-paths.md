# K-04 — Safety Escalation & Human Override Paths

## 1. Purpose and Scope
### 1.1 Mandatory Safety Infrastructure
Safety escalation and human override paths are mandatory infrastructure for the Zenthea Platform. In a system involving AI-driven patient interactions and medical data, a robust, deterministic mechanism for routing complex or high-risk scenarios to human operators is a non-negotiable safety requirement. These paths ensure that the system remains within its defined capability gates and that clinical or safety risks are handled by qualified professionals.

### 1.2 Non-Executing and Non-Authoritative Posture
This document defines a **design-only** framework for how the system identifies the need for human intervention. It maintains a strictly non-executing and non-authoritative posture. The escalation paths described herein do not execute medical actions, transmit orders, or automate clinical decisions; they provide the governance routing required to bring a human into the loop.

## 2. Relationship to Prior Phases
### 2.1 Phase E (Non-Executing Orchestration)
K-04 builds upon the foundation of Phase E, which established the principle of orchestration without execution. Escalation is a specialized form of routing within this non-executing architecture.

### 2.2 Phase J (Runtime, Identity, Memory, Conversational Discipline)
The escalation logic utilizes the runtime environment and conversational discipline established in Phase J. It respects identity boundaries and memory constraints to ensure that escalation context is maintained without violating privacy or trust boundaries.

### 2.3 Phase K-01 through K-03 Dependencies
This design integrates with:
- **K-01 (Assistant Runtime Shell):** The shell through which escalation is surfaced.
- **K-02 (Product Interaction Surfaces):** The UI/UX surfaces where override controls exist.
- **K-03 (Intent Classification and Capability Gating):** The primary trigger mechanism where classified intents outside of AI capability thresholds necessitate escalation.

## 3. Definition of “Safety Escalation”
### 3.1 Governance Routing, Not Action
Safety escalation is defined as the deterministic routing of a session or interaction to a human-governed state. It is a transition of responsibility and oversight, not the execution of a clinical protocol.

### 3.2 Distinction Between Escalation, Execution, and Delegation
- **Escalation:** Moving the interaction from AI-led to human-supervised or human-led.
- **Execution:** The performance of an action (e.g., calling 911), which remains strictly out of scope for the AI.
- **Delegation:** The assignment of a task to a service, which must still pass through capability gates.

## 4. Triggers for Escalation
Escalation MUST be triggered when any of the following conditions are met:

### 4.1 Safety Uncertainty
The AI cannot determine with high confidence that a response or action is safe within the current context.

### 4.2 Clinical Ambiguity
A user presents symptoms or requests information that falls outside the deterministic clinical paths or requires professional medical judgment.

### 4.3 Policy Conflict
The user request conflicts with established safety policies, consent models, or platform guardrails.

### 4.4 User Distress or Risk Indicators
Detection of language indicating self-harm, harm to others, or acute medical distress (e.g., "I'm having chest pain," "I want to end it all").

### 4.5 Intent Classification Failure (from K-03)
When the intent classification engine in K-03 returns a "Low Confidence" or "Unrecognized Intent" result for a potentially safety-sensitive request.

## 5. Human Override Model
### 5.1 Roles Authorized to Override
- **Clinician:** May override AI-suggested content or gating for patients under their care.
- **Operator / Admin:** May override system-level blocks or routing for operational maintenance.

### 5.2 Overridable Elements
- Suggested responses to patients.
- Capability gate blocks (subject to role-based authority).
- Interaction frequency limits.

### 5.3 Non-Overridable Elements (Immutable Safety Laws)
- PHI protection and privacy guardrails.
- Identity verification requirements.
- Core safety audit logging.
- Prohibition on AI execution of medical orders.

### 5.4 AI Self-Override Prohibition
The AI is strictly prohibited from overriding its own capability gates, safety triggers, or human-imposed blocks. AI-suggested "bypasses" are to be treated as failures.

## 6. Escalation Paths by Role
### 6.1 Patient Escalation
Patients may request to speak to a human at any time. The system must provide a clear path to human support when requested or when safety triggers are hit.

### 6.2 Clinician Escalation
Clinicians can escalate a patient session to an "Intervention Required" state, pausing AI interaction until the clinician has reviewed or taken over the thread.

### 6.3 Operator / Admin Escalation
Operators can escalate technical or policy anomalies to the appropriate governance body or technical team.

### 6.4 Cross-Role Authority Escalation Prohibition
The system must never allow an escalation path to grant a role authority it does not inherently possess (e.g., an Operator cannot escalate themselves to have Clinician-level medical override authority).

## 7. Interaction and UX Constraints
### 7.1 Communication of Escalation
The system must inform the user when an escalation is occurring using neutral, factual language. 
- **Required:** "I am routing this conversation to our support team for further assistance."
- **Prohibited:** "Don't worry, a doctor will be with you in one minute."

### 7.2 Language Requirements
All escalation-related messaging must be deterministic and pre-approved by the Safety and UX committees.

### 7.3 No Promises, No Urgency, No Implied Follow-up
The AI must never promise a specific response time, imply that an emergency is being handled by the AI, or suggest that a human is currently watching the screen unless that human has explicitly engaged.

## 8. Failure, Denial, and Ambiguity Handling
### 8.1 Deterministic Behavior
Escalation logic must be hard-coded and deterministic. If trigger X is met, routing Y must occur.

### 8.2 Fail-Closed Defaults
If the escalation system itself fails (e.g., routing service is down), the AI must fail-closed: it must cease interaction with the user and display a static safety message (e.g., "The system is currently unavailable. If this is an emergency, please call 911.").

### 8.3 No Silent Escalation or Suppression
Escalations must always be logged and surfaced to the appropriate human dashboard. They cannot be suppressed or handled "silently" by the AI.

## 9. Audit and Observability
### 9.1 Metadata-Only Audit
All escalation events and human overrides must be logged with high-fidelity metadata.
- **Recorded:** Timestamp, Triggering Event Type, Role Initiating Override, Destination of Escalation, Session ID.
- **PHI Protection (NOT Recorded):** The specific clinical content of the message that triggered the escalation must not be stored in the primary audit log; the audit log should reference the secure, HIPAA-compliant message store instead.

## 10. Explicit Prohibitions
- **No Automatic Escalation to Execution:** Escalation never triggers an automated external action (e.g., calling emergency services).
- **No Background Agents:** No "safety agents" may operate without being part of the primary, audited orchestration flow.
- **No Execution:** As per Phase E, no execution of medical or financial transactions is authorized via these paths.
- **No Authority Transfer:** Escalation does not transfer the AI's "identity" to a human; the human acts as themselves.
- **No Bypass of Identity or Consent:** Escalation paths must never bypass the core identity and consent checks established in Phase J.

## 11. Out of Scope
- Implementation of the UI/UX for human dashboards.
- Paging systems or SMS/Phone alerting infrastructure.
- Specific clinical protocols or triage logic.
- Incident response workflows after the escalation has occurred.
- Integration with external Electronic Health Records (EHR) for override synchronization.

## 12. Exit Criteria
### 12.1 Governance Review
Approval of this design by the Platform Architect and Clinical Safety Officer.

### 12.2 UX Safety Validation
Verification that the proposed interaction constraints prevent the AI from making false promises.

### 12.3 Security and Privacy Sign-off
Confirmation that the audit and routing models comply with HIPAA and internal data protection policies.

## 13. Closing Governance Statement
**This document authorizes understanding and design alignment only. It does not authorize implementation, execution, automation, or authority transfer.**
