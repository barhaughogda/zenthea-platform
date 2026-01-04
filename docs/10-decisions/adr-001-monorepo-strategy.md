# ADR-001: Monorepo Strategy

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is designed to support:
- Multiple backend services
- Multiple frontend applications
- Shared packages and tooling
- Heavy AI integration (agents, prompts, evals)
- Solo and small-team development
- Long-term evolution and reuse across clients and industries

The system must balance:
- High velocity for a solo engineer
- Strong architectural boundaries
- Safe AI governance
- Reuse across many applications
- Low operational overhead

A core structural decision was required around repository strategy:
- Monorepo vs multi-repo (polyrepo)

This decision has long-term implications for developer experience, AI tooling, CI/CD, governance, and architectural integrity.

---

## Decision

We will use a **single monorepo** to host:

- All backend services
- All frontend applications
- All shared packages
- All documentation
- All prompt assets
- All architectural decisions

The monorepo is the **system of record** for the entire platform.

We explicitly reject a polyrepo strategy.

---

## Rationale

The monorepo strategy was chosen for the following reasons:

### 1. Architectural Visibility

A monorepo:
- Makes system boundaries explicit
- Allows architecture to be understood holistically
- Prevents hidden coupling across repositories

This is especially important for AI-heavy systems where behavior emerges from many layers working together.

---

### 2. AI Tooling Leverage

Modern AI coding tools (for example Cursor, Claude Code, GPT-based agents):
- Perform best with full-repo context
- Can reason across services, prompts, and docs
- Can enforce patterns more reliably in a single repo

A monorepo maximizes AI leverage.

---

### 3. Consistent Governance

A monorepo allows:
- One set of build guidelines
- One prompt governance system
- One CI/CD pipeline
- One observability strategy
- One compliance model

This reduces fragmentation and drift.

---

### 4. Reuse Without Copying

Shared code, patterns, and prompts:
- Live in shared packages
- Are imported explicitly
- Are versioned together

This avoids copy-paste reuse, which is the primary failure mode in polyrepo systems.

---

### 5. Reduced Operational Overhead

For a solo or small team:
- Managing many repos is expensive
- Coordinating releases across repos is error-prone
- Keeping architecture consistent is difficult

A monorepo minimizes coordination cost.

---

### 6. Controlled Independence

Although the code lives in one repo:
- Services are independently deployable
- Frontends are independently deployable
- Ownership boundaries remain explicit

Monorepo does not mean monolith.

---

## Alternatives Considered

### Alternative 1: Polyrepo (One Repo per Service/App)

**Description**
- Separate repositories for each service and frontend

**Why it was rejected**
- High coordination overhead
- Harder to enforce architectural standards
- Reduced AI tooling effectiveness
- Increased duplication of patterns and docs
- More difficult to evolve prompts and AI governance consistently

This approach optimizes for large teams, not this platform’s goals.

---

### Alternative 2: Hybrid (Core Repo + Per-Client Repos)

**Description**
- Core services in one repo
- Client-specific apps in separate repos

**Why it was rejected**
- Creates artificial boundaries
- Encourages divergence and forks
- Makes cross-client reuse harder
- Complicates AI context and tooling

Configuration and composition are preferred over repo-level separation.

---

## Consequences

### Positive Consequences

- Strong architectural coherence
- Excellent AI tooling performance
- Easier onboarding for humans and AI agents
- Centralized documentation and decisions
- Reduced long-term maintenance cost

---

### Negative Tradeoffs

- Requires discipline to maintain boundaries
- CI/CD must be optimized to avoid slow pipelines
- Requires tooling to limit scope of builds and tests

These tradeoffs are acceptable and mitigated by tooling and guidelines.

---

## Compliance and Security Impact

- Easier to enforce consistent compliance rules
- Centralized auditability
- Reduced risk of divergent security practices

A monorepo strengthens compliance posture.

---

## AI and Automation Impact

- Enables repo-wide AI reasoning
- Allows prompts, evals, and code to evolve together
- Simplifies automation and refactoring by AI agents

This decision directly supports the platform’s AI-first strategy.

---

## Implementation Notes

- Strict folder structure is enforced
- Dependency rules prevent improper coupling
- CI/CD is scoped to affected projects
- Documentation and ADRs live alongside code

Discipline is enforced socially and technically.

---

## Related Documents

- `/docs/01-architecture/monorepo-strategy.md`
- `/docs/08-build-guidelines/build-philosophy.md`
- `/docs/08-build-guidelines/service-build-guide.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR intentionally prioritizes long-term clarity and AI leverage over short-term convenience.