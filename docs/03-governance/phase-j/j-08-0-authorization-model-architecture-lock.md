# Phase J.8.0 — Authorization Model Architecture Lock (DESIGN-ONLY)

## 1. Purpose
This phase establishes the conceptual authorization model class for the Zenthea Platform. It defines the foundational architectural constraints and the permitted family of authorization paradigms. This document is strictly design-only; it dictates the essential properties and constraints of the authorization model class without defining specific implementation details, schemas, or logic.

## 2. Authorized Objectives
The primary objective of Phase J.8.0 is to lock the single permitted authorization model family and establish the fundamental requirements for all authorization decisions within the platform substrate.

- **Locking the Model Family**: Only Attribute-Based Access Control (ABAC) is permitted as the architectural foundation. The model must rely on the evaluation of attributes associated with subjects, resources, and environmental context.
- **Prohibition of Alternative Paradigms**: All other authorization paradigms, including but not limited to Role-Based Access Control (RBAC) as a primary mechanism, Discretionary Access Control (DAC), and Mandatory Access Control (MAC), are explicitly forbidden as foundational models.
- **Static and Explicit**: Authorization constraints must be static in their architectural definition and explicitly declared. 
- **Deterministic and Externally Supplied**: Authorization decisions must be deterministic. The logic governing these decisions must be externally supplied to the enforcement points, ensuring a clear separation between policy definition and enforcement.
- **Trust Boundaries**: All authorization decisions must occur at defined trust boundaries. No entity within a lower-trust zone may influence the authorization state of a higher-trust zone.
- **Determinism Guarantees**: The architecture must guarantee that for any given set of inputs (attributes and state), the authorization decision is consistent and reproducible.

## 3. Authorized Conceptual Content
The authorization model class is characterized by the following high-level properties and conceptual flow:

- **High-Level Flow**: The conceptual flow is defined as: Subject Request → Boundary Interception → Decision Point (Attribute Evaluation) → Enforcement/Rejection.
- **Invariants**: 
    - **No Implicit Privilege Escalation**: The model must prevent any mechanism where a subject can gain permissions not explicitly granted through attribute evaluation.
    - **Fail-Closed**: All authorization requests must fail-closed. In the absence of an explicit permit, access is denied.
- **Decision Determinism**: The decision process must be a pure function of the provided attributes and the locked policy architecture.

## 4. Explicitly Forbidden (Hard Prohibitions)
The following elements are strictly prohibited from this phase and this document:
- Executable code of any kind.
- Configuration files (YAML, JSON, etc.).
- Specific policy definitions or rules.
- Role definitions or hierarchies.
- Capability definitions.
- Permission schemas or database structures.
- Evaluation logic or algorithms.
- References to specific authorization engines or libraries.
- References to specific vendors or frameworks.
- Persistence models or storage implementations.
- Changes to the `AuthorityContext` structure or semantics.
- Wiring to specific transports, services, or domains.

## 5. Regulatory & Safety Constraints
- **Auditability**: Every authorization decision must be conceptually auditable, allowing for the reconstruction of the decision-making process.
- **Inspectability**: The authorization model must be transparent and inspectable by governance authorities.
- **Explainability**: Decisions must be explainable in terms of the attributes evaluated.
- **Least Privilege**: The model must enforce the principle of least privilege as a foundational requirement.
- **Data Privacy**: No Protected Health Information (PHI) or Personally Identifiable Information (PII) is permitted within the authorization state or decision logic.
- **Clinical Safety**: The authorization model must support clinical safety by ensuring that only authorized personnel can access sensitive medical functions, following data minimization principles aligned with GDPR.

## 6. Phase Boundaries
- Phase J.8.0 defines the **Authorization Model Class Only**.
- **J.8.1**: Detailed model properties and specific attribute requirements are deferred to Phase J.8.1.
- **J.8.2**: The semantics and structure of the `AuthorityContext` are deferred to Phase J.8.2.
- **Later Phases (J.8.4+)**: Actual execution, implementation logic, and integration are deferred to Phase J.8.4 and beyond.

## 7. Lock Statement
- **Design-Only**: This phase is strictly design-only. No implementation artifacts are authorized.
- **Foundational**: The constraints established herein are foundational to the Zenthea Platform security architecture.
- **Final and Immutable**: This phase is declared final and immutable. Any modifications must be processed through a formal governance amendment.
