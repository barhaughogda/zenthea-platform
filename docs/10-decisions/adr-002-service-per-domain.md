# ADR-002: Service per Domain

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is designed to support:
- Multiple business capabilities (chat, sales, accounting, marketing, project management, etc.)
- AI-driven agents operating within clear responsibility boundaries
- Multi-tenant deployments across many clients and industries
- Long-term evolution without architectural collapse

A critical decision was required around **service boundaries**:
- How services are defined
- What each service owns
- How responsibilities are separated
- How AI behavior is scoped and governed

Without clear domain boundaries, systems drift into tightly coupled, fragile architectures that are difficult to evolve and unsafe to automate with AI.

---

## Decision

We adopt a **service-per-domain** architecture.

Each backend service:
- Owns exactly one well-defined business domain
- Is the single authority for its domain’s data and rules
- Encapsulates all AI behavior related to that domain
- Is independently deployable and scalable

A service may not own multiple unrelated domains.

---

## Rationale

This decision was made for the following reasons:

### 1. Clear Ownership and Authority

A service-per-domain model ensures:
- One place to look for domain logic
- One authoritative source of truth
- Clear responsibility boundaries

This is essential for correctness, especially in AI-assisted systems.

---

### 2. Safe AI Integration

AI behavior must be scoped tightly.

By binding AI capabilities to a single domain:
- Prompts are simpler and safer
- Tools are clearly constrained
- Evaluation and testing are domain-specific
- Hallucination and overreach risk is reduced

AI agents are powerful only when constrained.

---

### 3. Independent Evolution

Domains evolve at different speeds.

Service-per-domain enables:
- Independent refactoring
- Independent deployment
- Independent scaling
- Independent AI iteration

This prevents slow domains from blocking fast ones.

---

### 4. Strong Multi-Tenancy Guarantees

Domain ownership simplifies:
- Tenant isolation
- Data access control
- Compliance enforcement
- Auditing and observability

Cross-domain data sharing becomes explicit and traceable.

---

### 5. Frontend Composition Without Backend Coupling

Client frontends compose multiple domains.

This is only safe when:
- Each domain is independently authoritative
- Services do not rely on shared databases
- Cross-domain workflows are coordinated externally

Service-per-domain enables clean frontend composition.

---

## What “Domain” Means Here

A domain is:
- A coherent business capability
- With its own language and rules
- With its own data model
- With clear boundaries

Examples of valid domains:
- Chat
- Sales
- Accounting
- Marketing
- Project Management

Examples of invalid domains:
- “User”
- “Utils”
- “Common”
- “AI”

Shared concerns belong in packages, not services.

---

## Alternatives Considered

### Alternative 1: Layer-Based Services

**Description**
- Separate services for API, AI, data, etc.

**Why it was rejected**
- Breaks domain encapsulation
- Increases cross-service chatter
- Makes AI reasoning fragmented
- Complicates ownership

This approach optimizes for infrastructure, not business logic.

---

### Alternative 2: Large Monolithic Services

**Description**
- One or two large services owning many domains

**Why it was rejected**
- Blurs responsibility
- Makes AI prompts overly broad
- Increases blast radius of changes
- Slows evolution over time

This approach does not scale cognitively or operationally.

---

### Alternative 3: Client-Specific Services

**Description**
- Separate services per client or industry

**Why it was rejected**
- Leads to duplication and divergence
- Makes maintenance expensive
- Prevents reuse
- Complicates AI governance

Configuration and composition are preferred over forking.

---

## Consequences

### Positive Consequences

- Clear service ownership
- Safer AI behavior
- Easier testing and evaluation
- Clean deployment boundaries
- Predictable system evolution

---

### Negative Tradeoffs

- Requires discipline in defining domains
- Cross-domain workflows require orchestration
- Initial design effort is higher

These tradeoffs are intentional and acceptable.

---

## Compliance and Security Impact

- Domain boundaries simplify compliance audits
- Sensitive data remains within domain-specific controls
- Logging and access control are easier to reason about

Service-per-domain strengthens security posture.

---

## AI and Automation Impact

- Prompts are smaller and more precise
- Tools are tightly scoped
- Evaluations are domain-specific
- AI agents are easier to reason about and trust

This decision directly supports safe AI automation.

---

## Implementation Notes

- Each service follows the canonical service template
- Each service owns its data store
- Cross-domain interaction occurs via APIs or events
- Client-specific overrides are tightly scoped

Violations require an ADR.

---

## Related Documents

- `/docs/08-build-guidelines/service-build-guide.md`
- `/docs/06-frontends/composition-patterns.md`
- `/docs/09-prompts/prompt-architecture.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR intentionally prioritizes clarity and safety over short-term convenience.