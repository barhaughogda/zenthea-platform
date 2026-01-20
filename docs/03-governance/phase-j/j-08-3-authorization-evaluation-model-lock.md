# Phase J.8.3 — Authorization Evaluation Model (DESIGN-ONLY)

## 1. Purpose
This document defines the conceptual model for how authorization decisions are evaluated within the Zenthea Platform using the `AuthorityContext`. 

*   **Design-Only Scope:** This phase does **not** define which entities are authorized, what specific rules or policies exist, or how the enforcement mechanism is implemented in code.
*   **Core Objectives:** To establish a framework for authorization evaluation that prioritizes strict determinism, absolute auditability, and fail-closed safety.

## 2. Authorized Scope (Design-Only)

### 2.1 Evaluation Boundary Definition
*   **Single Evaluation:** Exactly one authorization evaluation shall occur per discrete request or operation.
*   **Temporal Placement:** Evaluation occurs immediately after successful authentication and strictly before any service logic or business execution begins.
*   **Atomic Gate:** Evaluation is a pure, single-step gate. 
*   **Prohibition on Complexity:** Layered, chained, or distributed authorization checks across multiple services or components are explicitly forbidden for a single request context.

### 2.2 Evaluation Inputs
*   **Sole Input:** The `AuthorityContext` (as defined in J.8.2) is the sole authorization input for the evaluation process.
*   **Explicit Resource Identifiers:** The evaluation must target explicit, non-ambiguous resource identifiers.
*   **Explicit Action Identifiers:** The evaluation must target explicit, non-ambiguous action identifiers (e.g., READ, WRITE, EXECUTE).
*   **Prohibited Inputs:** The evaluation process is strictly forbidden from accessing business data, performing persistence reads, enriching context from external sources, performing inference, or utilizing any dynamic context not contained within the `AuthorityContext`.

### 2.3 Evaluation Output Semantics
*   **Binary Outcome:** The result of an evaluation must be binary: `ALLOW` or `DENY`.
*   **Deterministic Error Mapping:** Outcomes must map deterministically to standardized, non-leaking error categories that do not reveal the underlying logic or missing attributes.
*   **Prohibited Granularity:** Partial authorization, data filtering, field-level redaction, or any influence on business logic (beyond the binary gate) are explicitly forbidden at this layer.

### 2.4 Determinism and Safety Guarantees
*   **Referential Transparency:** Given the same `AuthorityContext`, resource, and action, the evaluation must always produce the same result.
*   **Side-Effect Free:** The evaluation process must be pure, producing no side effects and performing no mutations to state or context.
*   **Fail-Closed Behavior:** Any missing, invalid, or ambiguous input (within the `AuthorityContext` or request parameters) must result in an immediate `DENY`.
*   **No Mitigation Paths:** Defaults, fallbacks, retries, or recovery paths within the evaluation logic are strictly prohibited.

### 2.5 Auditability & Observability Constraints
*   **Conceptual Auditability:** The model ensures that every decision is conceptually traceable.
*   **Reconstructability:** Sufficient metadata must exist such that inputs and outcomes can be perfectly reconstructed for forensic review or regulatory audit.
*   **Internal Secrecy:** Logging or exposing the internal evaluation rationale, specific policy matches, or the structure of the underlying (yet to be defined) policy is strictly forbidden.
*   **Privacy Preservation:** Correlation of authorization evaluation events with Protected Health Information (PHI) or Personally Identifiable Information (PII) is explicitly forbidden within the authorization audit trail.

## 3. Explicitly Forbidden (Hard Prohibitions)
The following concepts and implementations are strictly prohibited in this phase:
*   **Traditional Models:** RBAC, ABAC, PBAC, ReBAC, or any hybrid variants.
*   **Identity Constructs:** Roles, permissions, scopes, entitlements, or groups.
*   **Mechanism Definitions:** Policy engines (e.g., OPA), policy languages (e.g., Rego, Cedar), or specific rule definitions.
*   **Logic Definitions:** Specific condition logic or rule sets.
*   **Implementation Artifacts:** Executable code, configuration files, database schemas, or Infrastructure as Code (IaC).
*   **External Dependencies:** References to specific vendors, frameworks, or libraries.

## 4. Phase Boundaries
*   **Phase J.8.3 Scope:** Defines evaluation semantics and the conceptual interface for decision-making only.
*   **Implementation Freeze:** No authorization behavior, logic, or enforcement may be implemented based on this document.
*   **Future Requirements:** Phase J.8.4 and subsequent phases are required to define specific authorization models, policy structures, and enforcement mechanisms.

## 5. Regulatory Rationale
*   **Predictability:** Ensures authorization behavior is predictable and lacks emergent properties that could lead to unauthorized data access.
*   **Non-Leakage:** Prevents the authorization layer from leaking information about the system's internal state or policy structure.
*   **Clinical Safety:** Supports the principle of least privilege and data minimization, critical for handling sensitive clinical data.
*   **Auditability:** Provides a regulator-grade audit trail that satisfies strict compliance requirements (HIPAA, GDPR, etc.) by ensuring decisions are deterministic and reconstructable.

## 6. Lock Statement
*   **DESIGN-ONLY:** This document is a conceptual specification only.
*   **Foundational:** This model serves as the immutable basis for all subsequent authorization phases.
*   **Finality:** Once approved, this document is final and immutable.
*   **Amendments:** Any deviations from these semantics require a formal governance amendment and architectural review.
