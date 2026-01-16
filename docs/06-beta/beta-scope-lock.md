# Beta Scope Lock: Zenthea v1

## 1. Purpose of This Document
This document defines the strict functional boundaries for Zenthea Beta v1. It serves as the definitive scope reference for internal alignment between founders, advisors, and the engineering team. This is an operational artifact intended to prevent scope creep and ensure focus on the single production-grade loop required for initial validation.

## 2. Beta Classification and Intent
Beta v1 is a **Limited Controlled Release (LCR)**. 
- **Intent**: To demonstrate and validate the end-to-end "Mock Consultation Loop" in a sandboxed but representative environment.
- **Status**: Non-commercial, non-clinical for real patients.
- **Audience**: Internal testers and select design partners only.

## 3. Beta Core: Mock Consultation Loop
The single production-grade loop for Beta v1 is the **Mock Consultation Loop**.
1. **Initiation**: Provider starts a mock session.
2. **Consultation**: Simulation of provider-patient interaction (text/voice-to-text).
3. **Drafting**: AI generates a clinical note draft based on the interaction.
4. **Review**: Provider reviews and edits the draft.
5. **Finalization**: Provider "signs" the note (logical seal only).

## 4. Explicitly Included Capabilities
- **Provider Dashboard**: Basic view of mock appointments and recent notes.
- **Live Interaction Capture**: Audio-to-text transcription via external provider (e.g., Deepgram/Whisper).
- **AI Drafting Engine**: Prompt-governed generation of SOAP notes or similar clinical formats.
- **Provider Review Interface**: Side-by-side view of transcript and generated draft with editing capabilities.
- **Note Export**: Basic markdown or PDF export of the finalized note.

## 5. Explicit Exclusions (Locked Out)
- **Real Patient Data (PHI)**: No real patient names, DOBs, or identifiers.
- **Electronic Health Record (EHR) Integration**: No direct writing to external EHR systems (e.g., Epic, Cerner).
- **Real-time Billing**: No Stripe integration or insurance claim generation.
- **Patient Portal**: No patient-facing interface or direct patient access.
- **Multi-tenant Organization Management**: Single organization context only.
- **Advanced Specialty Templates**: Only standard SOAP note templates are supported.

## 6. AI Behavior Lock
- **Non-Prescriptive**: AI will not suggest diagnoses or treatment plans unless explicitly requested as a draft.
- **Transparency**: Every AI-generated section must be clearly marked as "AI Suggested".
- **Gating**: AI cannot finalize or export a note without explicit human provider approval.
- **Hallucination Control**: AI is restricted to the context of the provided transcript; it MUST NOT invent patient history not present in the session.

## 7. Data, Persistence, and Safety Constraints
- **Ephemeral Storage**: Mock data may be purged periodically.
- **No Long-term Archival**: Beta v1 does not guarantee data retention beyond the testing window.
- **Safety Gating**: If the AI detects a high-risk scenario (e.g., mention of self-harm in transcript), it must trigger an immediate UI flag for the human operator.

## 8. Manual Workarounds and Operational Assumptions
- **User Provisioning**: New provider accounts are created manually via database scripts or admin panel.
- **Transcript Correction**: Providers may manually correct transcription errors if the automated system fails.
- **System Maintenance**: Scheduled daily downtime for updates; no 99.9% SLA is provided.

## 9. Failure Expectations and Escalation
- **Transcription Latency**: Delays in audio processing are expected.
- **Draft Quality**: AI drafts may require significant human editing in edge cases.
- **Escalation**: Technical failures should be reported via internal Slack channel `#beta-v1-bugs`.

## 10. Definition of Beta Success
Success for Beta v1 is defined by:
- **Loop Completion**: 100 consecutive mock consultations completed from initiation to finalization without system crash.
- **Provider Satisfaction**: >80% of internal testers agree that the AI draft reduced note-taking time by at least 50%.
- **Safety Compliance**: Zero instances of AI-generated prescriptions or "un-reviewed" notes being marked as finalized.

## 11. Scope Lock Rule
Any feature request or capability not explicitly listed in Section 4 is considered **Out of Scope** for Beta v1. Changes to this document require a formal scope review and re-alignment of delivery timelines.
