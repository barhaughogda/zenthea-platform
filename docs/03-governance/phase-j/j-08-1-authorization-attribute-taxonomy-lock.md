# Phase J.8.1 — Authorization Attribute Taxonomy Lock (DESIGN-ONLY)

## 1. Purpose
Phase J.8.1 defines the structural properties and allowed attribute taxonomy for the authorization model family locked in Phase J.8.0. This phase defines what kinds of attributes may exist and the invariants they must obey, without defining schemas, AuthorityContext structure, evaluation logic, policy rules, or execution mechanisms.

## 2. Authorized Scope
Authorization conceptual properties only, covering all of the following:

### 2.1 Attribute Categories (Conceptual)
Authorization may rely only on explicitly defined, non-overlapping categories:
- Subject attributes (who is acting)
- Resource attributes (what is being accessed)
- Action attributes (what operation is requested)
- Tenant attributes (organizational boundary)
- Environmental attributes (static execution context only)
Each category is explicitly declared, non-overlapping, and immutable during request evaluation.

### 2.2 Attribute Invariants
- Attributes are explicitly supplied; never inferred.
- Attributes are non-derivative (no computed or transitive attributes).
- Attributes are request-scoped and immutable for the duration of evaluation.
- Absence of a required attribute results in fail-closed denial.

### 2.3 Attribute Provenance Rules
Each attribute has a clearly defined provenance limited to:
- Supplied by the caller
- Supplied by authenticated identity
- Supplied by trusted runtime boundary
Attribute origins are explicitly forbidden from:
- Business data
- Persistence reads
- Request payload inspection
- Downstream service responses

### 2.4 Determinism and Safety Guarantees
- Authorization decisions are a pure function of the provided attributes.
- Attribute sets are fully serializable and auditable.
- Attribute evaluation is side-effect free at the architectural level.

## 3. Explicitly Forbidden (Hard Prohibitions)
The following are strictly prohibited in this phase and document:
- Executable code of any kind
- Policy definitions of any kind
- Conditional logic or evaluation semantics
- Rule syntax, rule languages, or algorithms
- Attribute values or enumerations
- Any AuthorityContext field definitions or structure
- Mapping to domain models or domain-derived attributes
- Persistence, caching, or lookup mechanisms
- Vendor, engine, or framework references
RBAC, scopes, permissions, roles, and policies remain explicitly forbidden in this phase.

## 4. Regulatory and Compliance Constraints
- Least privilege by construction
- Auditability through explicit attribute declaration
- GDPR alignment via data minimization and by forbidding PHI/PII in authorization attributes
- Prohibit behavioral inference and prohibit attribute enrichment from data content

## 5. Phase Boundaries
- J.8.1 defines what attributes may exist and their invariants
- J.8.2 defines AuthorityContext semantics and structure
- J.8.3+ defers execution, evaluation, and enforcement
No implementation is authorized in this phase.

## 6. Lock Statement
- DESIGN-ONLY
- Foundational
- Final and immutable once approved
- Deviations require a formal governance amendment
