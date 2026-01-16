# Zenthea Pilot: Clinician Onboarding

This document is for pilot clinicians. It explains what Zenthea does during the pilot, what it does not do, and what to do if anything feels off.

## What Zenthea is in the pilot
Zenthea is a clinician-assist tool that helps you create a clinical note draft during a consultation.

In the pilot, Zenthea:
- Helps you review patient context inside the Zenthea interface.
- Captures the consultation as text (via voice transcription or typed input).
- Produces an AI-suggested draft note (structured as a SOAP note).
- Lets you edit the draft before you choose to finalize it.

## What Zenthea is NOT
In the pilot, Zenthea is not:
- A replacement for your clinical judgment.
- An autonomous clinician. It does not “act” on its own.
- An EHR integration. It does not sync to external EHR systems.
- A billing tool. It does not create or submit claims.
- A prescribing or ordering system. It does not send prescriptions or place orders.
- A messaging tool. It does not contact patients or staff.

Zenthea provides suggestions. You decide what is correct and what becomes final.

## What happens during a consultation
The typical flow is:

1. **Select the patient**
   - You choose the patient record in Zenthea.
   - Zenthea may show a short context summary to help you orient.

2. **Start the session**
   - You explicitly start capture.
   - As you speak, Zenthea displays a live transcript. If you prefer, you can type instead of speaking.

3. **End the session**
   - You explicitly stop capture.
   - Zenthea processes the transcript and produces an **AI-suggested** draft note.

4. **Review and edit**
   - You compare the draft to what was actually said and done.
   - You edit, add, or delete text until the note reflects your clinical intent.

5. **Sign and Finalize**
   - Only after your review do you choose to finalize.

## What “Sign and Finalize” means
“Sign and Finalize” is your confirmation that the note is ready to be treated as final.

When you click it:
- The note status changes to “Finalized.”
- Zenthea records that the note was finalized by you (an audit trail of the action).
- Zenthea stops generating new changes for that note.

If you are not fully confident the note is accurate, do not finalize it. Continue documentation using your normal workflow.

## What data is stored (and what is not)
Zenthea stores the information needed to support the pilot documentation workflow, including:
- The patient record identifiers used in Zenthea for the session.
- The session transcript text.
- The AI-suggested draft note text.
- Your edits and the finalized note text (if you finalize).
- A record of key actions (for example, that you finalized the note).

Zenthea does not:
- Use pilot clinical data to train or fine-tune foundation models.
- Carry over PHI from one patient to another (“cross-patient memory”).
- Put PHI into general application logs for troubleshooting.

## How to recognize problems
Issues that should prompt extra caution include:

- **Wrong patient context**: The patient shown is not the person you intended.
- **Transcript mismatch**: The transcript is clearly wrong, missing large sections, or delayed enough that it’s hard to follow.
- **Draft inaccuracies**: The draft includes details that were not discussed or performed.
- **Overconfident tone**: The draft states something as a fact when it was uncertain or not assessed.
- **UI or system instability**: Errors, repeated refreshes, freezing, or losing text.

Any time you see a problem, treat the draft as untrusted until you have verified and corrected it.

## What to do if something feels unsafe
If anything feels unsafe or confusing:

1. **Stop and slow down**
   - Pause the Zenthea session (or end it) and continue care using your normal workflow.

2. **Do not finalize**
   - If you are unsure, leave the note unfinalized and document outside Zenthea.

3. **Tell the operator immediately**
   - The operator can pause the pilot session, collect the session details, and escalate.

4. **If needed, request the kill switch**
   - If there is any risk of incorrect clinical documentation being relied upon, or any concern about data handling, ask the operator to activate the kill switch.

## Reassurance: control and reversibility
During the pilot, you stay in control:
- You decide when capture starts and stops.
- You can edit, delete, or replace any AI-suggested text.
- Nothing becomes final until you click “Sign and Finalize.”
- If you want to stop using Zenthea mid-session, you can do so and return to your usual process.

If you are unsure at any point, stopping is a safe choice. You will not “break” the system by pausing or ending a session.
