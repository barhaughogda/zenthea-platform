# Phase G Entry Criteria

**Document Type:** Governance Artifact  
**Status:** Active  
**Classification:** Design-Only  
**Effective Date:** Upon formal governance approval  

---

## 1. Purpose of Phase G

Phase G defines the controlled transition from design-complete to implementation-eligible status within the Zenthea platform governance framework.

Phase G is about **permission**, not features. This phase does not introduce new capabilities, designs, or system behaviors. It establishes the governance process by which previously designed capabilities may be authorized for implementation.

No design work occurs in Phase G. No implementation work occurs in Phase G. Phase G exists solely to evaluate whether preconditions for execution authorization have been satisfied.

The purpose of Phase G is to:

1. Verify that all design artifacts from Phases E and F are complete and sealed.
2. Confirm that governance, security, clinical safety, and audit preconditions are met.
3. Establish the formal authorization record required before any execution code may be written.
4. Ensure that execution authorization is explicit, traceable, and revocable.

Phase G does not grant implementation authority. Phase G evaluates whether implementation authority may be granted.

---

## 2. What Phase G Is and Is Not

### Phase G Is

- A governance checkpoint between design completion and implementation eligibility.
- A formal evaluation of readiness across all required domains.
- A permission gate that must be explicitly opened before execution may proceed.
- A fail-closed mechanism: absence of explicit approval equals denial.

### Phase G Is Not

- A design phase. All design work was completed in Phases E and F.
- An implementation phase. No code, APIs, schemas, or UI may be created in Phase G.
- A feature definition phase. No new capabilities are introduced.
- A technical specification phase. No technical solutions are authored.
- An automatic progression. Completion of Phase F does not automatically grant Phase G approval.

### Explicit Prohibitions

Phase G does NOT allow:

- Writing, testing, or deploying any execution code.
- Creating technical specifications, API contracts, or database schemas.
- Designing user interfaces or interaction flows.
- Modifying any system behavior or configuration.
- Granting blanket or implied implementation authority.
- Proceeding without explicit, documented governance approval.

---

## 3. Execution Unblock Preconditions

Before any execution code may be written for any capability, ALL of the following preconditions MUST be satisfied:

### 3.1 Governance Preconditions

1. All Phase E design documents are sealed and unmodified.
2. All Phase F governance documents are sealed and unmodified.
3. A formal governance review has been conducted and documented.
4. Separation of duties between design authorship and execution authorization is verified.
5. A designated governance authority has provided explicit written approval.

### 3.2 Security Preconditions

1. Threat models for the target execution domain are complete and reviewed.
2. Security controls are defined and mapped to design artifacts.
3. Access control requirements are documented and verified.
4. Data protection requirements are documented and verified.
5. Incident response procedures are defined for the target domain.

### 3.3 Clinical Safety Preconditions

1. Clinical risk assessment for the target execution domain is complete.
2. Patient safety controls are defined and mapped to design artifacts.
3. Clinician override mechanisms are specified and verified.
4. Failure modes are enumerated with defined safe states.
5. Clinical escalation pathways are documented.

### 3.4 Audit Readiness Preconditions

1. Audit logging requirements are defined for all execution paths.
2. Evidence retention policies are documented.
3. Audit trail integrity mechanisms are specified.
4. Regulatory inspection support procedures are documented.
5. Chain of custody for audit evidence is defined.

### 3.5 Consent Preconditions

1. Consent models for the target execution domain are complete.
2. Consent capture mechanisms are specified.
3. Consent withdrawal pathways are defined.
4. Consent verification requirements are documented.
5. Consent state is queryable before any execution proceeds.

Failure to satisfy ANY precondition results in denial of execution authorization. There are no exceptions.

---

## 4. Authority and Approval Model

### 4.1 Approval Authority

Execution authorization requires approval from a designated governance authority. This authority must be:

1. Formally designated in writing prior to the Phase G evaluation.
2. Independent of the design authorship for the capability under review.
3. Accountable for the governance decision and its consequences.
4. Empowered to deny authorization without external override.

### 4.2 Separation of Duties

The individual or team that authored a design artifact is PROHIBITED from authorizing its implementation. This separation is mandatory and non-negotiable.

Design authorship and execution authorization must be performed by distinct individuals or teams with no reporting relationship that could compromise independence.

### 4.3 Prohibited Approval Patterns

The following approval patterns are PROHIBITED:

1. **Unilateral approval:** No single individual may authorize execution without independent verification.
2. **Implicit approval:** Silence, inaction, or elapsed time do not constitute approval.
3. **Delegated approval:** Approval authority may not be delegated to automated systems or subordinates.
4. **Conditional approval:** Approval may not be granted contingent on future actions or unverified assumptions.
5. **Retroactive approval:** Execution that occurs before formal approval is a governance violation, not a candidate for retroactive authorization.

### 4.4 Approval Record Requirements

Every execution authorization must produce a formal approval record containing:

1. Identification of the capability authorized for implementation.
2. Identification of the approving governance authority.
3. Date and time of approval.
4. Explicit statement that all preconditions have been verified.
5. Scope limitations for the authorization.
6. Expiration conditions, if any.
7. Signature or equivalent attestation.

---

## 5. Evidence Required for Unblock

Execution authorization requires documented evidence that readiness has been verified. Assumed readiness is explicitly forbidden.

### 5.1 Required Evidence Categories

The following evidence categories MUST be present and verified before execution may be authorized:

#### 5.1.1 Audit Evidence

1. Audit logging design is complete and reviewed.
2. Audit event taxonomy for the target domain is defined.
3. Audit storage and retention mechanisms are specified.
4. Audit integrity verification mechanisms are specified.
5. Audit access controls are defined.

#### 5.1.2 Consent Evidence

1. Consent model is complete and reviewed.
2. Consent capture points are enumerated.
3. Consent state management is specified.
4. Consent withdrawal is supported at all capture points.
5. Consent verification occurs before execution.

#### 5.1.3 Rollback Evidence

1. Rollback procedures are defined for the target domain.
2. Rollback triggers are enumerated.
3. Rollback scope is defined (transaction, session, or broader).
4. Rollback verification mechanisms are specified.
5. Rollback does not require system restart or data loss.

#### 5.1.4 Failure Handling Evidence

1. Failure modes are enumerated for the target domain.
2. Safe failure states are defined for each failure mode.
3. Failure detection mechanisms are specified.
4. Failure notification pathways are defined.
5. Failure recovery procedures are documented.

### 5.2 Evidence Verification

Evidence must be:

1. **Documented:** Evidence must exist in a durable, retrievable form.
2. **Traceable:** Evidence must reference the design artifacts it supports.
3. **Verifiable:** Evidence must be independently confirmable.
4. **Current:** Evidence must reflect the current state of design artifacts.
5. **Complete:** Partial evidence does not satisfy requirements.

### 5.3 Prohibited Assumptions

The following assumptions are PROHIBITED in evidence evaluation:

1. "This will be addressed during implementation."
2. "Standard practices will apply."
3. "The team understands what is needed."
4. "This is covered by existing infrastructure."
5. "We can fix this after initial deployment."

Evidence must demonstrate readiness, not intent.

---

## 6. Risk Acceptance and Liability Posture

### 6.1 Risk Acknowledgment

Execution authorization includes acknowledgment of residual risk. Residual risk is the risk that remains after all specified controls are applied.

Residual risk must be:

1. Identified and documented.
2. Quantified or characterized to the extent possible.
3. Explicitly accepted by a designated authority.
4. Communicated to affected stakeholders.

### 6.2 Risk Acceptance Authority

Risk acceptance requires a designated authority who is:

1. Empowered to accept risk on behalf of the organization.
2. Informed of the nature and magnitude of the risk.
3. Accountable for the consequences of risk acceptance.
4. Distinct from the design authorship team.

### 6.3 Prohibited Risk Transfer

The following risk transfer patterns are PROHIBITED:

1. **Silent risk transfer:** Risk may not be transferred to clinicians, patients, or downstream users without explicit notification and acceptance.
2. **Implicit risk transfer:** Deployment does not constitute acceptance of risk by users.
3. **Contractual obfuscation:** Risk may not be hidden in terms of service or user agreements.
4. **Operational assumption:** Risk may not be transferred by assuming operators will compensate for design limitations.

### 6.4 Liability Documentation

Execution authorization must include documentation of:

1. Where liability resides for system failures.
2. Where liability resides for clinical outcomes.
3. Where liability resides for data breaches.
4. Where liability resides for regulatory non-compliance.
5. How liability is communicated to affected parties.

---

## 7. Scope Limitation for Initial Execution

### 7.1 Single Domain Authorization

Phase G authorizes at most ONE execution domain at a time. Platform-wide execution enablement is explicitly prohibited.

An execution domain is a bounded set of capabilities that:

1. Share a common purpose or function.
2. Have a defined boundary with other domains.
3. Can be authorized, deployed, and revoked independently.
4. Have a defined set of preconditions specific to that domain.

### 7.2 Domain Sequencing

Execution domains must be authorized in sequence, not in parallel. Authorization of one domain does not imply authorization of related domains.

Each domain authorization requires:

1. Completion of all preconditions for that domain.
2. Independent governance review for that domain.
3. Explicit approval for that domain.
4. Separate approval record for that domain.

### 7.3 Prohibited Bulk Authorization

The following bulk authorization patterns are PROHIBITED:

1. Authorizing multiple domains in a single approval.
2. Authorizing a domain "and all dependencies."
3. Authorizing a domain "and all related capabilities."
4. Authorizing a domain "as part of a larger release."

### 7.4 Cross-Domain Dependencies

If an execution domain depends on another domain, both domains must be independently authorized before either may proceed to implementation.

Dependency authorization must be explicit. Assumed or implied dependencies do not satisfy this requirement.

---

## 8. Prohibited Actions

The following actions are PROHIBITED even with Phase G governance approval:

### 8.1 Voice and Ambient Execution

1. **Voice-triggered execution:** No system action may be triggered by voice input without explicit, verifiable user confirmation through a secondary channel.
2. **Ambient capture execution:** No system action may be triggered by passively captured audio, video, or environmental data.
3. **Implicit command interpretation:** No system action may proceed based on inferred intent from ambient signals.

### 8.2 Autonomous Execution

1. **Autonomous clinical decisions:** No clinical decision may be made without clinician review and explicit approval.
2. **Autonomous scheduling changes:** No appointment or schedule modification may occur without explicit user action.
3. **Autonomous data sharing:** No patient data may be shared with third parties without explicit consent for that specific sharing.
4. **Autonomous treatment modifications:** No treatment plan may be modified without clinician review and explicit approval.

### 8.3 Bulk Operations

1. **Bulk enablement:** No capability may be enabled for all users simultaneously.
2. **Bulk data operations:** No bulk data modifications without individual record verification.
3. **Bulk consent assumptions:** No consent may be assumed for groups of users.
4. **Bulk rollout:** No feature may be deployed to all environments simultaneously.

### 8.4 Bypass Operations

1. **Consent bypass:** No execution may proceed without verified consent.
2. **Audit bypass:** No execution may proceed without audit logging.
3. **Approval bypass:** No execution may proceed without governance approval.
4. **Verification bypass:** No execution may proceed without precondition verification.

---

## 9. Exit Criteria

Phase G is complete when the following conditions are satisfied:

### 9.1 Governance Record Creation

A formal governance record must be created containing:

1. Identification of the execution domain authorized.
2. Verification that all preconditions for that domain are satisfied.
3. Evidence inventory with references to supporting artifacts.
4. Risk acceptance statement from designated authority.
5. Approval statement from governance authority.
6. Scope limitations for the authorization.
7. Date of authorization and effective period.
8. Conditions for authorization revocation.

### 9.2 Authorization Constraints

The governance record must explicitly state:

1. What is authorized for implementation.
2. What is NOT authorized for implementation.
3. What conditions would invalidate the authorization.
4. What review is required before subsequent domains may be authorized.

### 9.3 Transition Requirements

Before entering implementation:

1. The governance record must be sealed and immutable.
2. The governance record must be accessible to all implementation participants.
3. Implementation participants must acknowledge the scope limitations.
4. A governance checkpoint must be scheduled for implementation review.

### 9.4 Failure to Exit

If exit criteria cannot be satisfied:

1. The execution domain remains blocked.
2. Deficiencies must be documented.
3. Remediation must occur before re-evaluation.
4. Re-evaluation follows the same precondition verification process.

There is no expedited path. There are no exceptions.

---

## 10. Closing Governance Statement

This document establishes the governance framework for Phase G of the Zenthea platform. It defines the preconditions, authorities, evidence requirements, and constraints that govern the transition from design-complete to implementation-eligible status.

Phase G is a permission gate, not a feature phase. It exists to ensure that implementation proceeds only when all governance, security, clinical safety, audit, and consent requirements are verifiably satisfied.

The requirements in this document are mandatory. Failure to satisfy any requirement results in denial of execution authorization. There are no exceptions, expedited paths, or implied approvals.

**This document authorizes governance evaluation only. It does not authorize implementation or execution.**

---

*Document Version: 1.0*  
*Governance Framework: Zenthea Platform*  
*Phase: G (Entry Criteria)*
