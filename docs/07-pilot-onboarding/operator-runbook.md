# Pilot Operator Runbook (Session Observer)

This runbook is for the operator observing pilot sessions. It is written to support safe, repeatable sessions and fast intervention when something goes wrong.

## Pre-session checklist (before the clinician starts)
- [ ] Confirm you are scheduled to observe this session and are reachable for the entire duration.
- [ ] Confirm the clinician understands the pilot boundaries:
  - Zenthea drafts notes; clinician reviews and decides what is final.
  - No autonomous actions (no sending, submitting, prescribing, billing).
- [ ] Confirm the correct environment is being used for the pilot session (not a mock/demo environment).
- [ ] Confirm the patient in scope for the pilot and the required pilot consent/eligibility steps are complete (per pilot agreement).
- [ ] Confirm the clinician knows the “stop” option:
  - They can stop using Zenthea at any time and continue with their normal workflow.
- [ ] Confirm audio input is available if voice capture will be used; confirm typed capture is available as fallback.
- [ ] Confirm you know how to pause/stop the session and how to activate the kill switch (conceptually).
- [ ] Have a place ready to record:
  - Date/time, clinician, session identifier (if available), and key observations.

## What to monitor during a session
Watch for these moments and verify they look correct:

- **Patient selection**
  - The clinician selects the intended patient record.
  - The patient context shown matches the intended patient.

- **Start of capture**
  - Capture begins only after explicit clinician action.
  - A transcript appears and updates continuously (or typed input is being used).

- **During capture**
  - Transcript quality is reasonable (minor errors are expected; major mismatch is not).
  - The clinician remains in control; Zenthea is not “doing things” without confirmation.

- **End of capture → draft generation**
  - Draft generation starts only after the clinician ends capture.
  - The draft is clearly presented as AI-suggested and editable.

- **Review and finalization**
  - The clinician reviews and edits before finalizing.
  - “Sign and Finalize” occurs only when the clinician is satisfied with accuracy.

## Expected normal behavior
Use these as “normal” reference points:

- **Human control**: The clinician initiates and stops capture. Finalization is a deliberate action.
- **Transparency**: The transcript and draft are visible and editable.
- **Draft quality**: The draft is a starting point. Minor omissions or wording issues can happen; invented clinical facts should not.
- **Fallback works**: If voice transcription struggles, the clinician can switch to typing and continue.

## Warning signs (act immediately)
Treat these as reasons to pause the session and reassess:

- **Wrong patient risk**
  - The clinician appears to be in the wrong patient record, or the context looks mismatched.

- **Material inaccuracies**
  - The draft includes diagnoses, exam findings, medications, orders, or plans that were not discussed or performed.

- **System instability**
  - Crashes, repeated errors, freezing, loss of text, or inability to continue the flow.

- **Unexpected autonomy**
  - Any behavior suggesting Zenthea is sending, submitting, finalizing, or acting without explicit clinician confirmation.

- **Clinician discomfort**
  - The clinician expresses uncertainty, confusion, or concern about safety or data handling.

## How to pause or stop a session
Use the smallest safe action first, then escalate quickly if needed.

1. **Pause**
   - Ask the clinician to stop and hold.
   - Ask them to end capture if capture is running.

2. **Stop using Zenthea for the remainder of the visit**
   - Ask the clinician to continue with their standard documentation workflow.
   - Do not encourage “pushing through” if anything feels unsafe.

3. **Activate the kill switch**
   - Use the kill switch if there is any chance of patient harm, incorrect documentation being relied upon, or a data-handling concern.
   - If unsure, choose the kill switch and escalate afterward.

## Post-session review checklist
- [ ] Confirm whether the note was finalized.
  - If it was finalized, confirm the clinician reviewed and edited appropriately.
  - If it was not finalized, confirm the clinician documented using their normal workflow.
- [ ] Capture the key session facts:
  - Start/end time, clinician, patient identifier used in Zenthea (as allowed), and session identifier (if available).
- [ ] Record observed issues, including:
  - What happened, when, impact, and what was done to resolve it.
- [ ] If any safety concern occurred, record:
  - The exact concern, what prevented harm, and whether the kill switch was used.

## What to record as feedback vs. bugs
Use this split so issues are routed correctly.

### Feedback (product/workflow notes)
- Confusing wording or labels.
- Too many clicks or awkward navigation.
- Draft is “close but needs consistent edits” without invented facts.
- Slowdowns that are annoying but do not risk safety or data integrity.

### Bugs (engineering attention)
- Wrong patient displayed or patient context mismatch.
- Missing/garbled transcript that prevents safe review.
- Draft includes invented clinical facts (hallucinations).
- Crashes, data loss, inability to finalize or export, repeated errors.
- Any sign of actions occurring without explicit clinician confirmation.

When in doubt, log it as a bug and include a short, factual description of impact.
