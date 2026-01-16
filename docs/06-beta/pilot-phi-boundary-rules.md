# Pilot PHI Boundary Rules

## 1. Purpose of This Document
This document defines the Protected Health Information (PHI) handling boundaries for the Zenthea constrained pilot phase. It establishes the operational safety, compliance, and security guardrails required to move from mock data to limited real-world clinical data within the Mock Consultation Loop.

## 2. Scope and Non-Goals
- **Scope**: Only the "Mock Consultation Loop" (Provider-in-the-loop clinical drafting and scheduling proposals) using real patient data.
- **Non-Goals**: This document does not authorize general production availability, cross-institutional data sharing, autonomous agent execution, or any PHI handling outside the designated Pilot PHI Sandbox.

## 3. Pilot PHI Sandbox Boundary
- All PHI processing and storage MUST occur within the dedicated **AWS Pilot PHI Sandbox**.
- This sandbox is logically and physically isolated from development, testing, and other non-compliant environments.
- No PHI may egress this boundary except for authorized clinician review within the Zenthea Provider Interface.

## 4. Allowed PHI and Forbidden PHI
- **Allowed PHI**:
  - Patient identifiers (Name, DOB, MRN) required for clinical context.
  - Clinical notes/transcripts required for drafting the Mock Consultation.
  - Basic scheduling availability.
- **Forbidden PHI**:
  - Financial data, credit card numbers, or insurance billing details.
  - Genetic data or high-sensitivity behavioral health records (unless explicitly authorized for a specific sub-pilot).
  - Social Security Numbers (SSNs).

## 5. Access Control and Operator Responsibilities
- **Least Privilege**: Access is granted only to the minimum set of named operators required for pilot support.
- **Named Access**: All access must be attributed to an individual. Shared credentials (e.g., "admin", "dev-team") are strictly prohibited.
- **Clinician Oversight**: No PHI-derived artifact (draft note, schedule) may be used clinically without direct provider review and sign-off.

## 6. Retention, Deletion, and Disposal Rules
- **Pilot-Scoped**: Data retention is strictly bounded by the duration of the pilot phase.
- **Time-Bounded**: All PHI must be purged within 30 days of the conclusion of the pilot session or institutional withdrawal.
- **Explicit Disposal**: Deletion must be cryptographically verified and logged; simple "soft deletes" are insufficient for disposal compliance.

## 7. Logging, Audit, and Redaction Rules
- **Audit Logging**: All access to PHI (read, write, update, delete) must be logged with timestamp, user ID, and resource ID.
- **Never Logged**: PHI itself (e.g., patient names, clinical content) MUST NEVER appear in application logs, error traces, or performance monitoring metrics.
- **Redaction**: Automated redaction must be used for all non-clinical troubleshooting logs.

## 8. AI and PHI Handling Constraints
- **No Training**: Pilot PHI MUST NEVER be used to train or fine-tune foundation models.
- **No Cross-Patient Memory**: The AI session must be stateless regarding PHI; data from Patient A must never influence the context or suggestions for Patient B.
- **No Autonomous Actions**: The AI is prohibited from sending messages, updating records, or executing commands without human-in-the-loop verification.

## 9. Incident Posture and Kill Switch Authority
- **Kill Switch**: A centralized operational kill switch exists to immediately revoke all PHI access and halt pilot processing.
- **Ownership**: The Kill Switch is owned by the Security Officer and the Lead Clinician.
- **Operational Meaning**: Activation results in immediate session termination and data isolation within the Sandbox.

## 10. Change Control and Scope Lock
- Any expansion of the PHI schema, new data integrations, or background job introductions requires a formal security review and update to this boundary document.
- **Scope Lock**: This document forbids silent expansion into analytics, marketing, or external messaging platforms during the pilot phase.
