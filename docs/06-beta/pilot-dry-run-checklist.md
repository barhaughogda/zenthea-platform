# Pilot Dry-Run Checklist: Mock Consultation Loop

## 1. Purpose of This Checklist
This checklist provides a concrete, step-by-step procedure to rehearse and validate the Zenthea Mock Consultation Loop. It ensures the platform and operators are ready for early clinician involvement by surfacing failure modes in a controlled, PHI-free environment.

## 2. When to Run This Checklist
- **Weekly Readiness**: Every Monday morning to confirm environment stability.
- **Post-Deployment**: Immediately following any updates to the Beta platform.
- **Clinician Onboarding Prep**: 24 hours before a new clinician begins their first pilot session.
- **Troubleshooting**: To isolate issues reported by users.

## 3. Preconditions (Before Starting)
- [ ] You are on the `main` branch with a clean working tree.
- [ ] You have valid login credentials for the Zenthea Beta sandbox.
- [ ] You are using a supported browser (Chrome/Edge latest versions).
- [ ] Your microphone is connected and system permissions for audio capture are granted.
- [ ] No real patient data or PHI is present in your local environment.

## 4. Environment Verification
- [ ] **URL Accessibility**: Navigate to the pilot environment URL. Confirm the page loads in < 3 seconds.
- [ ] **Sandbox Mode Confirmation**: Verify the "SANDBOX: MOCK DATA ONLY" banner is visible.
- [ ] **Authentication**: Log in. Confirm successful redirection to the Provider Dashboard.
- [ ] **Audio Check**: Open system settings; verify the microphone level fluctuates with speech.

## 5. Dry-Run Execution Steps

### Access and Login
1. **Action**: Enter username and password. Click "Login."
   - **Expected Outcome**: Dashboard displays a list of mock patients. No errors in the console.

### Patient Context Selection
2. **Action**: Select mock patient "John Doe (TEST-001)" from the list.
   - **Expected Outcome**: Patient profile opens. "Context Summary" (AI-generated) appears within 5 seconds.
3. **Action**: Read the Context Summary.
   - **Expected Outcome**: Summary accurately reflects the last 2-3 mock encounters defined in the test data.

### Consultation Flow
4. **Action**: Click "Start Session." Speak clearly for 60 seconds (simulating a standard SOAP encounter).
   - **Expected Outcome**: "Recording" indicator is active. Live transcript begins appearing on screen within 3-5 seconds.
5. **Action**: Mention specific mock symptoms (e.g., "seasonal allergies," "slight cough").
   - **Expected Outcome**: Transcript captures these terms accurately.

### AI Assistance and Draft Generation
6. **Action**: Click "End Session."
   - **Expected Outcome**: Status changes to "Processing." AI drafting spinner is visible.
7. **Action**: Wait for draft completion (Expected: < 30 seconds).
   - **Expected Outcome**: A structured SOAP note draft appears. All sections (Subjective, Objective, Assessment, Plan) are populated.

### Human Review and Finalization
8. **Action**: Compare the AI draft with the session transcript.
9. **Action**: Edit one sentence in the "Subjective" section to correct a minor detail.
   - **Expected Outcome**: Text editor is responsive; changes persist locally.
10. **Action**: Click "Sign and Finalize."
    - **Expected Outcome**: Prompt confirms finalization. Note status changes to "Finalized." A "Download PDF/Markdown" button appears.

## 6. Failure Scenarios and Operator Responses

| Scenario | Operator Response |
| :--- | :--- |
| **Transcription Lag (>10s delay)** | Continue speaking. Note lag in log. If transcript stops, switch to manual typing in the "Manual Input" field. |
| **AI Hallucination** | Use the "Reset Draft" button. If the error persists, manually delete the hallucinated text and flag the session ID in `#beta-v1-bugs`. |
| **Login Failure** | Clear browser cache and cookies. Re-attempt login. If persistent, check internal status page for service outages. |
| **Browser Crash** | Refresh the page. Zenthea should restore the transcript from local cache. If data is lost, report to engineering. |

## 7. Data Handling and Boundary Verification
- [ ] **No PHI Check**: Scan the finalized note. Ensure no real names, SSNs, or addresses were accidentally entered.
- [ ] **Boundary Check**: Attempt to navigate to a restricted URL (e.g., admin settings). Confirm "Access Denied" or redirect to dashboard.

## 8. Teardown and Reset
- [ ] **Log Out**: Click "Logout" and confirm redirection to the login screen.
- [ ] **Clear Session**: If required for the next run, use the "Clear Mock History" tool to reset the test patient state.
- [ ] **Hardware**: Disconnect microphone or mute system audio capture.

## 9. Pass/Fail Criteria
- **PASS**: The loop was completed from Login to Finalization without system crashes, data loss, or PHI exposure.
- **FAIL**: Any "Critical" failure occurs (e.g., AI fails to generate a draft, session data is not saved, or PHI is introduced).

## 10. Notes and Observations Log
- **Date**: [YYYY-MM-DD]
- **Operator**: [Name]
- **Environment**: [Staging/Pilot-Sandbox]
- **Outcome**: [PASS/FAIL]
- **Observations**:
  - [Note any UI friction, lag, or unusual AI behavior here.]
