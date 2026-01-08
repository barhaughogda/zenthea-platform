# Clinical Documentation Agent (MIG-04A: Draft-only)

## Overview

The Clinical Documentation Agent (MIG-04A) delivers a **regulated-safe, draft-only workspace** for clinical documentation. It assists healthcare providers by generating draft proposals for clinical notes while enforcing strict governance and compliance boundaries.

**HARD CONSTRAINT: MIG-04A is draft-only.** This service does NOT support signing, attesting, finalizing, locking, or writing back to external EHRs. Those capabilities are reserved for MIG-04B.

## Implementation Status: Phase 3 (Deterministic Core)

The current implementation (Phase 3) provides the deterministic core and service skeleton:
- **Domain Layer**: Fully versioned, immutable draft models.
- **API Layer**: Zod-validated contracts for draft lifecycle.
- **Orchestration Layer**: Workflow sequencing with consent gates and audit emission.
- **AI Layer**: Draft-only generation logic with safety refusals and provenance capture.
- **Data/Integration**: Defined contracts and interfaces for repositories and EHR/Transcription read-access.

## Core Responsibilities

- **Draft Note Generation**: AI-assisted proposals for encounter notes, procedure notes, etc.
- **Versioned History**: Every save produces a new immutable version. No silent overwrites.
- **Amendments & Addenda**: Append-only corrections linked to prior versions.
- **Evidence Provenance**: Pointers to chart evidence and external guidelines.
- **Attestation Proposals**: "Ready for signoff" state (proposal-only; no signing action).

## Explicit Non-Goals (MIG-04A)

- **NO Signing/Attestation**: AI and the service are forbidden from creating legal medical records.
- **NO EHR Write-back**: All outbound mutations to clinical record stores are blocked.
- **NO Background Jobs**: No unattended state transitions or PHI mutations.
- **NO Diagnosis/Treatment Plans**: AI may only propose narrative based on provided facts.

## AI Safety Contract

- **Labeling**: Every output is labeled: `DRAFT ONLY (AI-assisted). Not signed. Not a legal medical record.`
- **Refusal**: AI refuses requests to sign, attest, finalize, or fabricate facts.
- **Provenance**: Full traceability of model, prompt version, and retrieval sources.
- **Consent Gate**: Hard-stop if `consent-agent` does not verify documentation consent.

## Observability & Audit

The following metadata-only events are emitted to the audit sink:
- `CREATE_DRAFT`: On draft shell or AI-accepted creation.
- `UPDATE_DRAFT`: On new version, state change, or amendment.
- `VIEW_DRAFT`: On read access.
- `DISCARD_DRAFT`: When a draft is marked as discarded (preserving history).

## Developer Guide

### Testing
```bash
pnpm test          # Run domain and orchestration unit tests
pnpm eval:ai       # Run AI safety and refusal evals
```

### Build
```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Compliance Notes

- **HIPAA**: Enforces minimum necessary access and metadata-only audit logging.
- **HITL**: Requires explicit clinician review and editing for all AI-proposed content.
- **Provenance**: Maintains a clear chain of custody from AI proposal to human edit.
