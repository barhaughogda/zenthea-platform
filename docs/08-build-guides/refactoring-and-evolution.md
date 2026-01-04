# Refactoring and Evolution

## Purpose

This document defines how the platform is refactored and evolved over time.

It explains:
- When refactoring is required
- How to refactor safely in a monorepo
- How to evolve services, frontends, and AI behavior
- How to avoid architectural drift
- How to make change reversible and observable

This document answers the question:
**“How do we improve the system continuously without breaking trust, stability, or compliance?”**

---

## Evolution Is Expected, Drift Is Not

Change is inevitable.

Drift is optional.

Rules:
- The system is expected to evolve
- The architecture is expected to remain intact
- Deviations must be deliberate and documented

Refactoring is a sign of health. Uncontrolled drift is a defect.

---

## When Refactoring Is Required

Refactoring is required when one or more of the following are true:

- Responsibilities are unclear or duplicated
- Logic appears in the wrong layer
- AI behavior becomes hard to explain or test
- Services grow beyond a single domain
- Client-specific logic leaks into shared code
- Workarounds become normalized

If engineers or AI agents say “it’s a bit messy,” refactoring is overdue.

---

## Types of Refactoring

### 1. Structural Refactoring

Examples:
- Moving logic to the correct layer
- Extracting shared logic into packages
- Splitting a service by domain
- Simplifying folder structure

Rules:
- Behavior must remain unchanged
- Tests must pass before and after
- Refactor in small, reviewable steps

Structure first. Behavior later.

---

### 2. Domain Refactoring

Examples:
- Clarifying domain boundaries
- Renaming entities for clarity
- Enforcing missing invariants
- Removing ambiguous states

Rules:
- Domain changes require domain tests
- Domain refactors may require API versioning
- Domain authority must remain deterministic

Domain clarity beats backward compatibility, but changes must be explicit.

---

### 3. AI Refactoring

Examples:
- Improving prompt structure
- Replacing brittle prompt logic
- Changing model strategy
- Introducing better evaluation

Rules:
- AI behavior must be evaluated before and after
- Prompt changes must be versioned
- Model changes must be reversible
- AI output contracts must remain stable

AI refactoring without evaluation is not allowed.

---

### 4. Frontend Refactoring

Examples:
- Extracting reusable components
- Simplifying feature modules
- Improving composition boundaries
- Removing duplicated UI logic

Rules:
- UX behavior must remain consistent
- Service contracts must not be bypassed
- No business logic moves into UI

UI refactors must reduce coupling, not increase it.

---

## Refactoring Workflow

All refactoring follows this canonical workflow:

1. Identify the problem clearly
2. Document intent and scope
3. Write or update tests
4. Refactor in small steps
5. Verify behavior is unchanged
6. Update documentation
7. Merge and monitor

Skipping steps creates hidden risk.

---

## Using AI During Refactoring

AI is encouraged for refactoring, with constraints.

Allowed:
- Code movement and cleanup
- Naming improvements
- Test generation
- Prompt restructuring
- Documentation updates

Not allowed:
- Unreviewed large rewrites
- Behavior changes without tests
- Silent architectural deviations

AI refactors must be reviewed with the same rigor as human refactors.

---

## Backward Compatibility Rules

Not all changes must be backward compatible, but:

- API changes require versioning
- Event schema changes require new versions
- AI output schema changes require validation updates
- Frontend contract changes require coordination

Breaking changes must be explicit and intentional.

---

## Refactoring and Compliance

In regulated modes:
- Refactors must preserve auditability
- Logging and traceability must not regress
- Data handling constraints must remain intact
- AI evaluation baselines must be revalidated

Compliance regressions block merges.

---

## Evolution Through Configuration

Prefer evolution through configuration over code changes.

Examples:
- Feature flags
- Prompt version selection
- Model selection
- Tool availability
- Tenant-specific behavior

Configuration-driven evolution is safer and faster to roll back.

---

## Deprecation Strategy

Deprecation must be explicit.

Rules:
- Mark deprecated code clearly
- Document replacement paths
- Define removal timelines
- Monitor usage before removal

Silent deprecation is not allowed.

---

## Architectural Decision Records (ADRs)

Any refactor that:
- Changes architecture
- Introduces a new pattern
- Removes an old constraint
- Trades one principle for another

Requires an ADR in `/docs/10-decisions`.

If future-you will ask “why,” write an ADR now.

---

## Metrics for Healthy Evolution

The system is evolving well when:
- Services remain small and focused
- AI behavior remains explainable
- Tests remain deterministic
- Docs stay aligned with reality
- New engineers or AI agents ramp quickly

Velocity without clarity is a warning sign.

---

## Common Failure Modes

Avoid these mistakes:
- Large unscoped refactors
- “While we’re here” rewrites
- AI-driven refactors without review
- Breaking contracts silently
- Letting TODOs accumulate indefinitely

These turn refactoring into risk.

---

## Summary

Refactoring and evolution should:
- Be continuous
- Be deliberate
- Be observable
- Be reversible
- Be documented

If evolution feels dangerous, the process is wrong.

Follow this guide and the system will improve without losing its shape.