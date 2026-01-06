# MIG-03 – Provider Portal (Clinician-Facing)

**Status:** Draft (Not Approved)  
**Owner:** Platform Architecture  
**Scope:** Provider Experience (Clinical Workflows)  
**Precondition:** MIG-02B complete and sealed

> STOP: Do not implement this slice until explicitly instructed.

---

## Purpose

Activate the clinician side of the platform.

This slice migrates and stabilizes the Provider Portal UI and proves HIPAA-by-design under clinician workflows while keeping high-risk actions **draft-first** and **human-in-the-loop**.

---

## What MIG-03 Is

- Migration and integration of the Provider Portal UI
- First slice where clinical workflows are central
- Still read-only / draft-first for anything high-risk

---

## Core Goals

Enable clinicians to:
- View patient context (PHI, scoped)
- Review AI-generated drafts
- Interact with clinical agents safely

Prove:
- HIPAA-by-design under real clinician workflows
- Reuse of platform primitives validated in MIG-02B

---

## In Scope

### Apps

- `apps/provider-portal`
- Legacy provider UI migrated and stabilized
- Thin shell, no business logic

### Services Used (Already Built)

- `consent-agent` (mandatory gatekeeper)
- `medical-advisor-agent` (advisory only)
- `clinical-documentation-agent` (draft notes, summaries)
- `chat-agent` (internal clinician messaging, not patient chat)
- `appointment-booking-agent` (view/manage schedules)

No new core agents are required to start MIG-03.

---

## Explicit Non-Goals

- No autonomous diagnosis
- No prescription writing
- No EHR write-back
- No billing actions
- No background automation

Everything remains:
- Draft-only
- Proposal-based
- Human-in-the-loop

---

## Order of Work (High Level)

1. Scaffold `apps/provider-portal`
2. Raw legacy UI migration
3. Stabilization and mock isolation
4. Controlled service integration:
   - Consent first
   - Documentation drafts
   - Medical advisor last
5. Audit, evals, compliance verification

---

## Why This Matters

This slice is where:
- regulators start caring
- clinicians start trusting
- AI governance is tested under real clinical workflows

If MIG-03 succeeds, Zenthea becomes more than a patient experience.

