# I-02 — Shadow Mode Signal Capture & Drift Analysis Design

## 1. Purpose and Scope
This document defines the governance framework for signal capture and drift analysis during Shadow Mode operations within the Zenthea Platform. The primary objective is to establish an evaluative-only mechanism to observe AI system performance in parallel with existing human-led clinical processes without introducing operational effects. This design ensures that system behavior is understood and validated against clinical standards before any transition to active execution.

## 2. Relationship to I-01 and Prior Phases
This artifact is an explicit extension of **I-01 (Shadow Mode Readiness and Execution Policy)**. It utilizes the audit and evidence models established in **Phase F (Audit and Evidence)** and incorporates behavioral baselines derived from **Phase H (Execution Simulation and Dry-Run)**. Shadow Mode signals serve as the final empirical validation layer required to satisfy the governance gates defined in the Platform Roadmap.

## 3. Definition of “Signal” in Shadow Mode
Within the context of Shadow Mode, a "signal" is defined strictly as a metadata-only observation of system state, intended logic, or proposed output. 
- **In-Scope**: Log timestamps, intent classification IDs, decision branch identifiers, and confidence scores.
- **Explicitly Excluded**: Protected Health Information (PHI), raw clinical text, actual patient identifiers, and any side effects that could impact live clinical records or patient care.

## 4. Signal Categories
The system shall capture signals across the following governance-critical categories:
- **Intent Signals**: Classification of the task the system intended to perform (e.g., "Schedule Follow-up").
- **Decision Alignment Signals**: The logical path selected by the model compared to the clinical protocol.
- **Timing/Latency Signals**: Processing duration and system responsiveness metrics.
- **Failure/Denial Signals**: Instances where the system self-terminates or identifies its own inability to fulfill a request.
- **Human Override or Divergence Signals**: Captured when a human clinician's actual action differs from the system's proposed (shadowed) action.

## 5. Drift Definition and Classification
"Drift" is defined as a measurable divergence between the Shadow Mode system’s proposed output and the established clinical baseline or human-operator action.
- **Acceptable Variance**: Divergence within pre-defined semantic or logical boundaries that does not compromise clinical safety or operational intent.
- **Drift vs. Error**: Disagreement between the AI system and a human operator does not constitute an error by default; it triggers a mandatory comparative review.
- **Qualitative Drift**: Shifts in tone, style, or interpretive nuance.
- **Quantitative Drift**: Statistical deviations in classification accuracy, latency, or frequency of specific intent triggers.

## 6. Drift Detection Rules (Design-Level Only)
Drift detection is governed by the following safety-critical rules:
- **Mandatory Review Trigger**: Any signal indicating a "High" severity decision misalignment must be flagged for clinical board review.
- **Shadow Mode Suspension**: If drift exceeds safety-critical boundaries—specifically where proposed shadow actions consistently violate clinical safety protocols—Shadow Mode operations must be suspended immediately.
- **Fail-Closed Monitoring**: If the signal capture mechanism itself fails or exhibits instability, the Shadow Mode session must be terminated to maintain environment integrity.

## 7. Human Review and Accountability Model
- **Clinical Reviewers**: Drift signals are reviewed by qualified clinical personnel who have no prior exposure to the Shadow Mode proposed outputs during the live session.
- **Suspension Authority**: The Chief Medical Officer (CMO) or designated Safety Officer holds the sole authority to pause or revoke Shadow Mode privileges based on drift analysis.
- **No AI Self-Approval**: The system is strictly prohibited from validating its own performance or automatically resolving drift discrepancies.

## 8. Evidence and Audit Requirements
- **Recording Posture**: All drift evidence must be recorded as immutable metadata logs within the Phase F Audit Model.
- **Metadata-Only Posture**: No PHI or raw clinical data shall be persisted within the drift analysis logs.
- **Traceability**: Every drift event must be traceable to a specific system version, timestamp, and the corresponding human-led operational context.

## 9. Failure, Dispute, and Ambiguity Handling
- **Inconclusive Cases**: If drift analysis cannot definitively categorize a divergence, the case must be marked as "Ambiguous" and escalated for manual adjudication.
- **No Silent Failures**: Any failure in the capture or analysis pipeline must generate a high-priority governance alert.
- **No Forced Resolution**: The system shall not attempt to force a consensus between shadow outputs and human actions; the divergence itself is the primary value of the analysis.

## 10. Explicit Prohibitions
- **No Auto-Tuning**: Real-time adjustment of model parameters based on shadow signals is strictly prohibited.
- **No Model Retraining**: Shadow signals shall not be used for automated model retraining or optimization.
- **No Execution Inference**: The system must not infer that a shadow output is "correct" simply because it was not flagged as drift.
- **No Suppression**: Negative or unfavorable signals must never be suppressed or filtered from the governance record.
- **No Patient Exposure**: Shadow outputs and drift analysis results must never be visible to patients or unauthorized personnel.

## 11. Out of Scope
The following components are strictly excluded from this design and will be addressed in future implementation phases:
- Real-time dashboards or visualization interfaces.
- Persistent storage systems for high-volume telemetry.
- Automated metrics calculation engines.
- Machine learning pipelines for drift remediation.
- Active execution logic or control paths.

## 12. Exit Criteria
To complete Phase I and transition towards execution unblocking, the following must be demonstrated:
- Proof of signal capture integrity without data leakage.
- Validated drift classification logic against historical Phase H datasets.
- Signed attestation by Clinical and Legal teams that the drift detection rules provide a sufficient safety margin.

## 13. Closing Governance Statement
This document authorizes the **understanding and design** of signal capture and drift analysis mechanisms only. It **does NOT authorize implementation, deployment, or execution** of any active system components. Any transition from design to implementation requires explicit secondary authorization from the Governance Board.
