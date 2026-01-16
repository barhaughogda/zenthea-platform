# Kill Switch and Escalation (Pilot)

This document defines the pilot kill switch and the actions that follow its use. It is written for the operator and internal team.

## What the kill switch is
The kill switch is a safety control that immediately stops Zenthea pilot operation for clinical sessions.

It exists so that, in a moment of uncertainty, the system can be halted first and reviewed second.

## When the kill switch should be used
Use the kill switch any time there is doubt about safety or appropriate handling of clinical information, including:
- The wrong patient record may be in use.
- Zenthea output contains material clinical inaccuracies that could be relied upon.
- The system behaves unexpectedly (errors, instability, loss of text, repeated failures).
- Any sign of actions occurring without explicit clinician confirmation.
- Any concern about data exposure or inappropriate access.
- A clinician asks to stop, or expresses discomfort.

**Using the kill switch is always the correct choice if unsure.**

## How to activate it (conceptually, not technically)
Activation is a deliberate operator action. Do not troubleshoot in the moment.

1. **Stop the live session**
   - Tell the clinician to pause.
   - Ask them to end capture immediately (if capture is running).

2. **Move the clinician to the safe fallback**
   - Ask the clinician to continue care and documentation using their normal workflow.

3. **Activate the kill switch**
   - Trigger the operator-controlled stop for pilot sessions.
   - Confirm the pilot is halted before doing anything else.

4. **Communicate clearly**
   - Tell the clinician the session is stopped by design and the next step is internal review.

## What immediately stops when activated
When the kill switch is activated:
- Ongoing capture/transcription stops for the pilot workflow.
- Draft generation/processing stops for the pilot workflow.
- Starting new pilot sessions is blocked until internal review clears the restart.

The priority is preventing further reliance on questionable outputs and preventing continued processing while a concern is investigated.

## What does NOT break
Activating the kill switch does not:
- Prevent the clinician from continuing patient care.
- Prevent the clinician from documenting in their usual system.
- Change or “fix” clinical content on its own.
- Automatically delete data.

The kill switch is a stop mechanism, not a repair mechanism.

## Escalation path after activation
After activating the kill switch, escalate immediately and keep communication factual.

1. **Notify internal leads**
   - Clinical lead for the pilot
   - Security owner for the pilot
   - Engineering owner/on-call for the pilot

2. **Preserve the facts**
   - Time of activation
   - Clinician involved
   - Patient identifier used in Zenthea (as allowed)
   - What was observed and why the kill switch was used

3. **Do not restart**
   - Do not resume pilot sessions until the internal review explicitly clears restart.

4. **Follow-up**
   - Record whether any harm was avoided by stopping early.
   - Capture any clinician feedback about what felt unsafe or confusing.
