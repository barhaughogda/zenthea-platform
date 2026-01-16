# Beta Mock Consultation Loop: Operational Flow

## 1. Purpose of This Document
This document defines the single production-grade interaction loop for Zenthea Beta v1. It serves as an operational blueprint and explanatory artifact to align product, clinical, and technical teams on the "Mock Consultation Loop." This flow is designed for demo walkthroughs, internal dry-runs, and pilot onboarding.

## 2. Overview of the Mock Consultation Loop
The Mock Consultation Loop is the core functional path for the Zenthea Beta. It encompasses the entire lifecycle of a provider-patient interaction, from initial context loading to the finalization of a clinical note. The loop is strictly limited to a sandboxed environment using mock patient data.

## 3. Preconditions and Setup
Before initiating a loop, the following conditions must be met:
- **Environment**: The Zenthea Beta platform is accessible and the user is authenticated as a Provider.
- **Mock Patient**: A mock patient record (non-PHI) has been selected or created.
- **Hardware**: Audio input (if using voice capture) is functional and permissions are granted.
- **Data State**: No active session is currently running for the selected provider.

## 4. Step-by-Step Consultation Flow

### 4.1. Patient Context Loading
- **Human Action**: Provider selects a mock patient from the dashboard.
- **System Action**: Platform surfaces the mock patient profile (Read-only).
- **AI Assistance**: None at this stage.

### 4.2. AI-Assisted Review and Summarization
- **System Action**: Platform displays previous mock notes and history.
- **AI Assistance**: AI generates a brief "Context Summary" of the last 2-3 mock interactions to refresh the provider's memory.
- **Review Step**: Provider reviews the summary before starting the session.

### 4.3. Interaction Capture
- **Human Action**: Provider clicks "Start Session" and begins the consultation (simulated via voice or text input).
- **System Action**: Platform captures audio/text in real-time.
- **AI Assistance**: Real-time transcription (via external API) converts audio to text.

### 4.4. Draft Generation
- **Human Action**: Provider clicks "End Session."
- **AI Assistance**: The AI drafting engine processes the transcript and context summary to generate a structured SOAP note draft.
- **Gating**: The draft is clearly labeled as "AI Suggested" and is not yet part of the patient record.

### 4.5. Human Review and Confirmation
- **Human Action**: Provider reviews the AI-generated draft side-by-side with the session transcript.
- **Human Action**: Provider edits, adds, or deletes content to ensure clinical accuracy and tone.
- **Confirmation Step**: Provider clicks "Sign and Finalize."
- **System Action**: The note is logically sealed and marked as "Finalized by [Provider Name]."

## 5. AI Assistant Role and Boundaries
- **Assisting, Not Acting**: The AI suggests content but never "signs" or "submits" on its own.
- **Context Lock**: The AI is restricted to information provided in the transcript and the pre-existing mock record.
- **Non-Prescriptive**: AI will not suggest new diagnoses or treatment plans that weren't discussed in the session.
- **Transparency**: Every AI-contributed line must be editable by the human provider.

## 6. Human Decision Points and Responsibilities
- **Initiation**: The human decides when to start and stop the data capture.
- **Fact-Checking**: The human is responsible for the clinical accuracy of the final note.
- **Safety Oversight**: The human must act on any system-generated safety flags (e.g., high-risk keyword detection).
- **Final Approval**: No note exists as a "Final" document without a human "Sign" action.

## 7. Failure Scenarios and Fallback Paths
- **Transcription Failure**: If audio-to-text fails or is too slow, the provider can manually type notes into the capture area.
- **Draft Hallucination**: If the AI draft contains inaccurate information, the provider must use the "Reset Draft" or manual edit function.
- **System Timeout**: In the event of a crash, the session transcript is cached locally to prevent data loss.
- **Escalation**: Report technical failures to the internal Slack channel `#beta-v1-bugs`.

## 8. What Is Explicitly Out of Scope During the Loop
- **Real Patient Interaction**: Use with real patients or PHI is strictly forbidden.
- **EHR Integration**: The system does not sync with any external Electronic Health Record.
- **Prescription Routing**: No actual prescriptions are sent to pharmacies.
- **Billing**: No insurance claims or billing codes are generated or submitted.

## 9. Signals of Successful Loop Completion
- **Logical Seal**: The note status changes to "Finalized."
- **Export Ready**: The finalized note is available for download in Markdown or PDF format.
- **Cleanup**: The session capture buffer is cleared, and the platform returns to the dashboard state.
- **Provider Verification**: The human provider confirms the note is a faithful representation of the mock encounter.
