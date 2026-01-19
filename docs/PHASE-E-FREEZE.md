# Phase E Freeze and Scope Lock – Pilot Clinical Experience Demo

## Status
- Phase E: FROZEN
- Date: Sunday Jan 18, 2026
- Owner / Authority: Principal Platform Architect and Clinical Safety Authority
- Scope: Phase E Demo UI only

## Purpose of This Lock
This document serves as the authoritative freeze and scope lock for Phase E of the Zenthea Platform, specifically focused on the Pilot Clinical Experience Demo. The purpose of this freeze is to ensure the absolute stability, auditability, and clinical safety of the demo environment. By locking the scope, we prevent unintended functional changes or "scope creep" that could compromise the integrity of the clinical experience or the platform's regulatory posture.

## In-Scope (Frozen)
The following functionality is explicitly frozen and constitutes the entirety of the Phase E Demo scope:

- **Demo workflow (Start → Record → Review → Finalize)**: The end-to-end journey for a clinician to initiate a session, capture audio, review the generated documentation, and finalize the encounter.
- **Transcript behavior (ephemeral, reference-only)**: Transcripts are generated and displayed for clinician reference during the session but are treated as ephemeral and are not persisted beyond the immediate session context.
- **SOAP draft generation and editing**: Automated generation of Subjective, Objective, Assessment, and Plan (SOAP) drafts from the session audio, with full editing capabilities for the clinician.
- **Clinician attestation and finalization**: A clear mechanism for the clinician to review, edit, attest to the accuracy of, and finalize the clinical documentation.
- **Demo-mode banners and trust signals**: Explicit visual indicators (banners, watermarks, and status messages) confirming that the system is operating in a controlled demo mode and highlighting key trust boundaries.

## Safety Guarantees
The following safety guarantees are architecturally enforced and locked:

- **No autonomous actions**: The system SHALL NOT perform any clinical actions or decisions without explicit clinician initiation and approval.
- **No persistence of audio or transcripts**: Raw audio files and intermediate transcripts are stored only in volatile memory or transient storage and are deleted immediately upon session termination or finalization.
- **No background listening**: The system captures audio ONLY when the recording interface is actively engaged and visually indicating "Recording" state to the clinician.
- **Clinician remains responsible for all content**: The clinician maintains sole responsibility for the accuracy, completeness, and appropriateness of all finalized clinical documentation. The system acts strictly as a drafting assistant.

## Explicitly Out of Scope
The following capabilities are strictly forbidden and shall not be introduced or simulated within Phase E:

- **True speaker diarization**: The system does not attempt to uniquely identify or distinguish between multiple speakers with clinical certainty.
- **Persistent transcripts**: Storage of transcripts for long-term retrieval or audit beyond the session finalization event is prohibited.
- **Voice commands**: Control of the platform or clinical workflows via voice input is out of scope.
- **EHR data storage**: Writing or persisting finalized documentation directly to a documentation repository beyond the demo sandbox is strictly forbidden.
- **Automated diagnosis or treatment**: The system SHALL NOT suggest diagnoses, recommend treatments, or provide clinical advice.
- **Background or continuous listening**: Any audio capture outside of the active, clinician-initiated recording session is prohibited.

## Known Limitations (Accepted)
The following limitations are known and accepted for the Phase E Pilot Demo:

- **Imperfect speaker inference**: The system may misattribute speech segments in multi-speaker environments.
- **Browser speech recognition variability**: Performance and accuracy of speech-to-text may vary based on browser version, hardware, and network conditions.
- **Demo-only constraints**: Certain platform features are mocked or simulated to maintain demo isolation and safety.

## Change Control
- **Bug fixes**: Modifications are allowed only if they resolve a defect without altering the frozen behavior or scope defined herein.
- **New functionality**: All other changes, enhancements, or feature requests require the initiation of a new development phase and are barred from Phase E.

## Exit Criteria
Phase E is considered complete when the Pilot Clinical Experience Demo has fulfilled its objectives. The transition to the next phase (Phase F) is triggered by the commencement of EHR backend integration and persistent clinical record work, which shall occur under a separate governance framework.

## Declaration
This Phase E Demo is a non-executing, clinician-controlled demonstration. It is not a production medical device or system. All clinical decisions and documentation remain under the full control and authority of the participating clinician.
