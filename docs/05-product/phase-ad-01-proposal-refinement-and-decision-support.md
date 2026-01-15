# Phase AD-01: Proposal Refinement and Decision Support Model

## 1. Status and Scope

| Attribute          | Value                                      |
| ------------------ | ------------------------------------------ |
| Classification     | PRODUCT / INTERACTION DESIGN               |
| Execution Status   | **EXECUTION IS NOT ENABLED**               |
| Scope              | Proposal refinement and decision support   |
| Document Type      | Design specification                       |
| Authority Level    | DESIGN-ONLY                                |

This document defines how proposals (as locked in Phase AC) MAY be refined, enriched, compared, and clarified for human decision-making. **EXECUTION IS NOT ENABLED.** No refinement activity described in this document triggers confirmation, execution, persistence to canonical stores, or authority transfer. All capabilities defined herein are fail-closed by design.

---

## 2. Purpose of This Document

### 2.1 Why Proposal Refinement Exists

Proposal refinement exists to improve the quality of human decision-making without conferring, implying, or enabling authority transfer. Humans reviewing proposals benefit from:

- Clarity in proposal structure and language.
- Completeness in the information presented.
- Visibility into risks and dependencies.
- Awareness of alternatives and trade-offs.
- Alignment between proposals and available evidence.

Refinement serves these needs without modifying the fundamental nature of proposals as non-executing, non-binding expressions of intent.

### 2.2 How Refinement Improves Decision Quality Without Authority Transfer

Refinement activities:

- MAY improve how proposals are presented.
- MAY surface information relevant to proposals.
- MAY structure proposals for easier comparison.
- MUST NOT confer authority to proceed.
- MUST NOT imply endorsement of any proposal.
- MUST NOT enable execution of any proposal.
- MUST NOT persist refined proposals as canonical records.

The distinction between refinement and authority transfer is absolute. Refinement is an aid to understanding. Authority remains exclusively with humans through governed channels defined elsewhere.

---

## 3. Binding Authorities and Dependencies

This document is governed by and MUST NOT contradict the following authoritative documents:

| Document                                            | Location                                                                  | Relevance                                                  |
| --------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Phase AC Product Lock                               | `docs/05-product/phase-ac-product-lock.md`                                | Establishes proposal definition baseline                   |
| Phase AC-01 Proposal Interaction Model              | `docs/05-product/phase-ac-01-proposal-interaction-model.md`               | Defines proposal interaction constraints                   |
| Phase AC-02 Proposal Persistence and Draft Governance | `docs/05-product/phase-ac-02-proposal-persistence-and-draft-governance.md` | Defines proposal persistence constraints                   |
| Phase AC-03 Proposal Review and Human Confirmation Model | `docs/05-product/phase-ac-03-proposal-review-and-human-confirmation-model.md` | Defines human review and confirmation constraints          |
| Phase AC-04 Proposal-to-Execution Consideration Boundary | `docs/05-product/phase-ac-04-proposal-to-execution-consideration-boundary.md` | Defines boundary between confirmation and execution        |
| Platform Status                                     | `docs/00-overview/platform-status.md`                                     | Declares canonical repository state                        |
| Execution Architecture Plan                         | `docs/01-architecture/execution-architecture-plan.md`                     | Reference only; execution remains blocked                  |

This document references these authorities without duplicating their content. The Execution Architecture Plan is referenced for orientation only; nothing in this document relies upon, enables, or advances execution capability.

---

## 4. Definition of "Proposal Refinement"

### 4.1 What Proposal Refinement IS

Proposal refinement is:

- An activity that improves the clarity, structure, or completeness of a proposal.
- A non-binding process that assists human understanding.
- A set of permitted actions that MAY be performed on draft or reviewed proposals.
- A decision support mechanism that surfaces information without directing decisions.
- An ephemeral or draft-scoped activity that does NOT create canonical records.

### 4.2 What Proposal Refinement IS NOT

Proposal refinement is NOT:

- Confirmation of a proposal.
- Approval of a proposal.
- Execution of a proposal.
- Persistence of a proposal to canonical data stores.
- Authority transfer of any kind.
- Endorsement or recommendation of a proposal.
- Automation of human decision-making.
- A pathway to execution readiness.
- A trigger for system action.

### 4.3 Explicit Exclusions

The following are explicitly excluded from the scope of proposal refinement:

| Excluded Activity      | Rationale                                                      |
| ---------------------- | -------------------------------------------------------------- |
| Confirmation           | Confirmation is a governed human action defined in AC-03       |
| Execution              | Execution is NOT ENABLED; requires separate governance         |
| Canonical Persistence  | Refinement artifacts are ephemeral or draft-scoped only        |
| Automation             | All refinement activities require human initiation or review   |
| Authority Transfer     | Refinement confers no authority whatsoever                     |

---

## 5. Refinement Objectives

Refinement activities MAY pursue the following objectives:

### 5.1 Clarity

Refinement MAY improve clarity by:

- Restructuring proposal language for readability.
- Resolving ambiguities in proposal wording.
- Standardising terminology within proposals.
- Separating distinct concerns within a proposal.

### 5.2 Completeness

Refinement MAY improve completeness by:

- Identifying missing information in proposals.
- Surfacing questions that proposals do not address.
- Highlighting dependencies that proposals do not specify.
- Indicating where additional context would improve understanding.

### 5.3 Risk Visibility

Refinement MAY improve risk visibility by:

- Surfacing risks associated with proposal options.
- Presenting risk information alongside proposals.
- Structuring proposals to make risks explicit.
- Linking proposals to relevant risk documentation.

### 5.4 Alternative Surfacing

Refinement MAY improve alternative awareness by:

- Presenting alternative proposals for comparison.
- Structuring alternatives in comparable formats.
- Highlighting differences between alternatives.
- Indicating trade-offs between alternatives without ranking.

### 5.5 Evidence Alignment

Refinement MAY improve evidence alignment by:

- Linking proposals to relevant evidence sources.
- Indicating where proposals align with or diverge from evidence.
- Presenting evidence summaries alongside proposals.
- Structuring proposals to reference supporting documentation.

---

## 6. Permitted Refinement Actions

The following refinement actions are permitted. All permitted actions are non-binding and do NOT confer authority.

### 6.1 Clarification

Clarification involves restating proposal content to improve understanding. Clarification:

- MAY reword proposal language.
- MUST NOT alter the substantive intent of the proposal.
- MUST NOT add commitments or obligations not present in the original.
- MUST retain traceability to the original proposal content.

### 6.2 Rewording

Rewording involves modifying proposal language for improved readability. Rewording:

- MAY simplify complex language.
- MAY standardise terminology.
- MUST NOT change the meaning of the proposal.
- MUST be clearly attributable as a refinement activity.

### 6.3 Structuring

Structuring involves organising proposal content for easier comprehension. Structuring:

- MAY reorganise proposal sections.
- MAY add headings or formatting.
- MAY separate distinct concerns.
- MUST NOT remove substantive content.
- MUST NOT add substantive content not derivable from the original.

### 6.4 Comparison

Comparison involves presenting multiple proposals or alternatives side by side. Comparison:

- MAY present proposals in comparable formats.
- MAY highlight differences between proposals.
- MUST NOT rank proposals by preference.
- MUST NOT indicate which proposal should be selected.
- MUST NOT create implied recommendations through presentation order or emphasis.

### 6.5 Evidence Linking

Evidence linking involves associating proposals with relevant documentation or data. Evidence linking:

- MAY reference existing evidence sources.
- MAY summarise relevant evidence.
- MUST NOT fabricate evidence.
- MUST NOT selectively present evidence to favour particular outcomes.
- MUST clearly distinguish between proposal content and linked evidence.

### 6.6 Confidence Indication

Confidence indication involves noting the completeness or reliability of proposal information. Confidence indication:

- MAY note where information is incomplete.
- MAY indicate uncertainty in proposal details.
- MUST NOT be used to imply recommendations.
- MUST NOT be used to discourage or encourage particular decisions.
- MUST be factual and verifiable.

---

## 7. Assistant Participation Rules

### 7.1 Permitted Assistant Behaviours

Assistants MAY:

- Suggest refinements to proposals.
- Offer clarifications of proposal language.
- Present structured comparisons of alternatives.
- Link proposals to relevant evidence.
- Indicate where information is incomplete or uncertain.
- Answer questions about proposal content.
- Explain refinement options to humans.

### 7.2 Prohibited Assistant Behaviours

Assistants MUST NOT:

- Confirm proposals.
- Approve proposals.
- Execute proposals.
- Persist proposals to canonical data stores.
- Confer or imply authority.
- Rank proposals by preference.
- Recommend specific proposals for selection.
- Create pressure toward particular decisions.
- Infer human intent and act upon it.
- Escalate proposals without explicit human action.
- Perform refinement activities in the background without human awareness.

### 7.3 Mandatory Labelling Requirements

All assistant-generated refinement content MUST include:

- A visible indicator that the content originated from an assistant.
- The assistant session or context identifier.
- A timestamp of content generation.
- An explicit statement that the content is for decision support only.
- An explicit statement that the content does NOT constitute confirmation, approval, or recommendation.

---

## 8. Human Authority and Control

### 8.1 Humans Retain Sole Authority

Humans retain sole authority over:

- Whether to accept or reject refinement suggestions.
- Whether to proceed with any proposal.
- All decisions regarding proposal confirmation.
- All decisions regarding proposal disposition.
- All actions that would advance proposals toward execution consideration.

No refinement activity transfers, diminishes, or modifies human authority.

### 8.2 Refinement Does NOT Imply Endorsement

The act of refining a proposal:

- MUST NOT be interpreted as endorsement of the proposal.
- MUST NOT be interpreted as recommendation of the proposal.
- MUST NOT be interpreted as preference for the proposal.
- MUST NOT be interpreted as readiness for confirmation.

Refinement is a neutral activity that improves understanding without expressing preference.

### 8.3 Review Does NOT Imply Confirmation

The act of reviewing a refined proposal:

- MUST NOT be interpreted as confirmation.
- MUST NOT be interpreted as approval.
- MUST NOT trigger any state change that implies confirmation.
- MUST NOT advance the proposal toward execution.

Review and refinement are distinct from confirmation. Confirmation requires explicit human action as defined in Phase AC-03.

---

## 9. Data and State Boundaries

### 9.1 No Canonical Mutation

Refinement activities MUST NOT result in:

- Modification of canonical patient records.
- Modification of canonical appointment records.
- Modification of canonical provider records.
- Modification of any authoritative system state.
- Creation of operational records.
- Mutation of any data that would be treated as canonical.

### 9.2 No Silent Persistence

Refinement activities MUST NOT result in:

- Persistence of refinement artifacts without human awareness.
- Storage of refinement content in canonical data stores.
- Creation of records that imply confirmation or execution occurred.
- Audit log entries that misrepresent refinement as operational action.
- Any form of persistence that is not explicitly draft-scoped and ephemeral.

### 9.3 Refinement Artifacts Are Ephemeral or Draft-Scoped Only

Refinement artifacts:

- MAY exist in ephemeral storage for the duration of a refinement session.
- MAY exist in draft-scoped storage that is clearly distinguished from canonical data.
- MUST NOT be treated as authoritative system state.
- MUST NOT be referenced as evidence of confirmation or execution.
- MUST be distinguishable from canonical records at all times.

---

## 10. Decision Support vs Decision Making Boundary

### 10.1 Explicit Separation

This document establishes an explicit separation between:

| Activity           | Nature                                      | Authority Implication        |
| ------------------ | ------------------------------------------- | ---------------------------- |
| Decision Support   | Providing information to aid human decisions | NONE                         |
| Decision Making    | Exercising authority to select an outcome    | REQUIRES HUMAN ACTION        |

Refinement is decision support. Refinement is NOT decision making.

### 10.2 Prohibition of Implied Recommendations

Refinement activities MUST NOT:

- Present information in ways that imply a preferred outcome.
- Structure comparisons to favour particular alternatives.
- Use language that pressures humans toward decisions.
- Emphasise certain options through formatting, ordering, or repetition.
- Create urgency or time pressure to influence decisions.
- Frame options as defaults that require effort to reject.
- Use confidence indicators to discourage consideration of alternatives.

### 10.3 Prohibition of Implied Pressure

Refinement activities MUST NOT create pressure through:

- Suggestions that delay will result in negative consequences.
- Indications that particular decisions are expected.
- Framing that presents non-action as failure.
- Language that implies human responsibility for system outcomes.
- Any mechanism that shifts decision-making burden from information to obligation.

---

## 11. Explicitly Blocked Behaviours

The following behaviours are explicitly prohibited in Phase AD-01:

### 11.1 No Auto-Refinement

Proposals MUST NOT be automatically refined based on:

- Proposal content or characteristics.
- Time elapsed since proposal creation.
- System rules or conditions.
- Patterns detected in proposals.
- Any trigger that does not require explicit human initiation.

### 11.2 No Background Analysis

The system MUST NOT perform:

- Background analysis of proposals without human awareness.
- Silent evaluation of proposal quality or completeness.
- Asynchronous refinement processing.
- Scheduled refinement activities.
- Any analysis that occurs without explicit human request.

### 11.3 No Ranking Without Criteria

The system MUST NOT:

- Rank proposals by preference.
- Order proposals to imply preference.
- Score proposals on subjective dimensions.
- Present rankings that do not derive from explicit, human-provided criteria.
- Create implicit rankings through presentation choices.

### 11.4 No Execution Readiness Inference

The system MUST NOT infer execution readiness from:

- Refinement activities or completion.
- Proposal structure or completeness.
- Number of refinement iterations.
- Human engagement with refinement features.
- Any signal derived from refinement behaviour.

### 11.5 No Escalation to Execution Pathways

Refinement activities MUST NOT:

- Advance proposals toward execution consideration.
- Create conditions that trigger execution pathways.
- Signal execution readiness to any system.
- Establish execution eligibility.
- Bridge refinement to any execution-related state.

---

## 12. Relationship to Future Phases

### 12.1 How AD-01 Enables AD-02 and AD-03

Phase AD-01 establishes the foundational refinement model for decision support. Future phases MAY build upon this foundation:

- Phase AD-02 MAY define additional decision support capabilities.
- Phase AD-03 MAY define integration between decision support and other platform surfaces.

These future phases are NOT authorised by this document.

### 12.2 AD-01 Does NOT Enable Execution

This document:

- Does NOT enable execution of any kind.
- Does NOT confer execution readiness.
- Does NOT authorise execution planning.
- Does NOT establish execution design.
- Does NOT define execution governance.
- Does NOT satisfy any execution governance requirement.

### 12.3 Progression Requires New Governance

Advancement beyond the capabilities defined in this document requires:

- New governance artifacts with explicit authorisation.
- Human approval at appropriate authority levels.
- Documented readiness evidence.
- Explicit enablement authorisation.

This document does NOT provide or constitute such governance.

---

## 13. Change Control Rules

### 13.1 Document Immutability

Once this document is committed and locked:

- Its content MUST NOT be modified in place.
- Corrections require a superseding document with explicit reference.
- The commit hash serves as the immutable reference.
- Interpretive modifications are prohibited.
- Clarifications that alter meaning are prohibited.

### 13.2 Supersession Requirements

A superseding document MUST:

- Explicitly reference this document.
- State which sections are superseded.
- Provide rationale for changes.
- Undergo equivalent review and approval.
- Maintain governance integrity.
- Preserve the fail-closed nature of refinement capabilities.

---

## 14. Closing Governance Statement

**This document authorizes NOTHING operational.**

- No execution is enabled.
- No confirmation is enabled.
- No canonical persistence is enabled.
- No authority transfer is enabled.
- No autonomous actions are authorised.
- No execution signals are emitted.
- No execution preparation is permitted.
- No execution readiness is conferred.
- No decision-making authority is granted.

This document defines how proposals MAY be refined for human decision-making. It does NOT authorise any action beyond refinement for understanding.

**EXECUTION REMAINS BLOCKED** pending future governance phases and explicit enablement authorisation.

---

*End of Document*
