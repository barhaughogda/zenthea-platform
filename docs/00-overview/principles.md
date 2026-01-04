# Principles

This document defines the core principles that govern all decisions in this repository.

These principles translate the vision into enforceable rules. They are intentionally opinionated and are meant to constrain design, implementation, and extension of the system.

If a design decision conflicts with one or more principles in this document, the decision must be reconsidered or explicitly justified and documented.

---

## 1. AI Is Core Infrastructure, Not a Feature

AI is treated as infrastructure in this platform.

This means:
- AI participates directly in service execution
- AI capabilities are embedded into service logic
- AI behavior is observable, testable, and governed

AI is not added “on top” of existing software.  
Software is designed to support AI-driven work.

Any service that does not meaningfully integrate AI is considered incomplete.

---

## 2. Services Are the Primary Unit of Value

The system is designed around services, not applications.

Each service:
- Owns a single, well-defined domain
- Encapsulates its AI logic internally
- Exposes a stable API contract
- Can operate as a standalone product

Frontends, workflows, and integrations are secondary concerns and must not contain core business or AI logic.

---

## 3. API-First, Frontend-Agnostic Design

All services must be API-first.

This means:
- Every service exposes its full functionality through an API
- APIs are designed before frontends
- No service assumes the existence of a specific UI

Frontends consume services.  
Services never depend on frontends.

This principle enables composability, reuse, and independent evolution.

---

## 4. Composability Over Customization

The platform prioritizes composability instead of bespoke customization.

This means:
- Behavior is configured through policy, prompts, and inputs
- Services are reused across products and verticals
- New products are assembled from existing services

Custom logic should be introduced by composing services, not by forking or rewriting them.

---

## 5. Clear Boundaries and Explicit Ownership

Every component in the system must have clear ownership and responsibility.

This applies to:
- Services
- Shared packages
- AI runtime components
- Data models

Implicit behavior and hidden coupling are not acceptable.  
If a responsibility is shared, it must be documented explicitly.

---

## 6. Determinism Over Cleverness

The system prioritizes predictability and clarity over clever or opaque solutions.

This means:
- Clear execution paths
- Explicit configuration
- Reproducible behavior
- Minimal magic

This principle applies especially to AI behavior, where determinism and observability are critical for trust and maintenance.

---

## 7. Documentation Is a First-Class Artifact

Documentation is not secondary to code.

This means:
- Documentation is written before or alongside implementation
- Documentation defines intended behavior
- Documentation is authoritative

If code and documentation disagree, the documentation is considered correct until explicitly updated.

---

## 8. Designed for Human and AI Collaboration

The platform is designed to be built and extended by humans working alongside AI agents.

This means:
- Documentation must be unambiguous and structured
- Patterns must be repeatable
- Constraints must be explicit

AI agents are treated as first-class contributors that require the same clarity and guardrails as human engineers.

---

## 9. Security and Compliance Are Design Constraints

Security and compliance are not optional layers.

This means:
- Data handling is explicit and minimal
- Access is controlled and auditable
- AI behavior is constrained by policy
- Compliance considerations influence architecture from the start

The system must be capable of operating in regulated environments without fundamental redesign.

---

## 10. Observe Everything That Matters

If a behavior matters, it must be observable.

This includes:
- AI decisions
- Tool usage
- Data access
- Service interactions

Observability is required for:
- Debugging
- Evaluation
- Trust
- Compliance

Unobservable behavior is considered a defect.

---

## 11. Minimize Irreversible Decisions

The system favors reversible decisions wherever possible.

This means:
- Modular architecture
- Provider-agnostic interfaces
- Replaceable components

When an irreversible decision is necessary, it must be documented explicitly in an Architecture Decision Record (ADR).

---

## 12. Evolve Through Feedback and Evaluation

The platform is designed to improve over time.

This means:
- Feedback loops are built into services
- AI behavior is evaluated continuously
- Regressions are detected early

Progress is measured by system quality and leverage, not just speed of delivery.

---

## 13. Small Team, High Leverage

The platform is optimized for a very small team.

This means:
- Automation over process
- Clear defaults over configuration sprawl
- Reuse over reinvention

Any design that assumes a large engineering organization must be reconsidered.

---

## Principle Hierarchy

When principles conflict, the following precedence applies:

1. Security and compliance
2. Clear service boundaries
3. Determinism and observability
4. Composability and reuse
5. Convenience and speed

This hierarchy exists to resolve ambiguity when tradeoffs are unavoidable.

---

These principles define how this system is built and how decisions are made.  
They should change rarely and only with deliberate intent.