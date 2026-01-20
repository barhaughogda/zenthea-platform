# Phase J.8.5 — Authorization Model & Engine Selection (DESIGN-ONLY)

## 1. Purpose
The purpose of Phase J.8.5 is to select and lock the authorization model and evaluation engine concept. This phase defines WHAT model is used for authorization decisions, not HOW it is implemented. It establishes the conceptual framework for evaluating access requests within the Zenthea platform.

## 2. Authorized Scope (Design-Only)

### 2.1 Authorization Model Selection
The authorized authorization model paradigm is an **Attribute-Based Access Control (ABAC)** model.
- **Inputs**: The model accepts three primary input vectors: `Subject Attributes`, `Resource Attributes`, and `Action Attributes`, collectively derived from the `AuthorityContext` (J.8.2).
- **Evaluation Semantics**: Decisions are based on the evaluation of predicates against the attribute taxonomy defined in J.8.1, adhering to the evaluation model specified in J.8.3.
- **Outcomes**: The evaluation MUST result in a binary outcome: `ALLOW` or `DENY`.

### 2.2 Evaluation Engine Concept
The authorized evaluation engine pattern is a **Deterministic Pure Function**.
- **Mandate**: Evaluation MUST be deterministic (same inputs always yield same result), stateless (no side effects or reliance on external state), and pure.
- **Fail-Closed**: Any error, ambiguity, or missing attribute MUST result in a fail-closed `DENY` decision.
- **Hard Prohibition**: Executable engines, libraries, frameworks, or third-party binaries are strictly forbidden at this stage.

### 2.3 Policy Representation (Conceptual Only)
Policies are represented conceptually as a collection of static, declarative rules.
- **Constraints**: There shall be no dynamic rules, no mutation of policies at runtime, no inheritance between policies, and no external calls during policy evaluation.
- **Hard Prohibition**: The creation or use of policy files, Domain-Specific Languages (DSLs), schemas, or third-party policy engines is strictly forbidden.

## 3. Explicitly Forbidden (Hard Prohibitions)
The following are strictly prohibited in Phase J.8.5:
- Executable logic or code implementation.
- Configuration files or environment-specific settings.
- Active policy definitions or rule sets.
- Role-Based Access Control (RBAC) or mixed models.
- Scopes, IAM integrations, or external identity providers.
- Integration of Open Policy Agent (OPA), Cedar, or similar engines.
- Caching mechanisms, persistence layers, or database interactions.
- Logging, metrics collection, or distributed tracing.
- Network calls or inter-process communication.
- Framework-specific features or decorators.

## 4. Safety & Regulatory Constraints
- **Determinism**: All authorization decisions must be reproducible and predictable.
- **Statelessness & Purity**: The evaluator must not maintain or modify any state.
- **Auditability**: The model must support clear tracing of which attributes led to a decision (conceptually).
- **Data Privacy**: PHI (Protected Health Information) and PII (Personally Identifiable Information) are strictly forbidden in inputs, outputs, or error messages.
- **Failure Handling**: On any evaluation failure, the system MUST return a binary `DENY`. No rationale or internal decision logic shall be disclosed to the requester.

## 5. Phase Boundaries
- Phase J.8.5 defines the authorization model paradigm and evaluator concept only.
- Phase J.8.6 is required for the authorization of policy representation formats.
- Phase J.9.x is required for any transition to executable authorization logic or implementation.

## 6. Lock Statement
Phase J.8.5 is hereby declared **DESIGN-ONLY**. The selected model and evaluation semantics are **IMMUTABLE** once approved. Any deviation or modification requires a formal governance amendment and approval process.
