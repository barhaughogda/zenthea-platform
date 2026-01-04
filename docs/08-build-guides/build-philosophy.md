# Build Philosophy

## Purpose

This document defines the philosophy that governs how software is built inside this repository.

It explains:
- How work should be approached
- What “done” actually means
- How humans and AI agents are expected to behave
- Which tradeoffs are acceptable and which are not
- How velocity and quality coexist

This document answers the question:  
**“How do we build things here, and what behavior is expected?”**

---

## Build for Longevity, Not Demos

Everything in this repository is built with the assumption that it will:
- Live for years
- Be modified many times
- Be read by humans and AI
- Be operated in production environments

Quick demos that bypass architecture are explicitly discouraged.

If something cannot survive reuse, it does not belong.

---

## Architecture Is a Constraint, Not a Suggestion

The architecture defined in `/docs` is mandatory.

Rules:
- You do not “work around” the architecture
- You do not bypass layers for speed
- You do not introduce shortcuts without documentation

If the architecture feels restrictive, that is intentional.

Constraints create clarity.

---

## Small, Complete Changes Over Big Bangs

Work should be delivered as:
- Small
- Complete
- Reviewable
- Reversible

Rules:
- Each change should have a clear purpose
- Partial implementations are not acceptable
- Half-finished abstractions are not allowed

If a change cannot be explained simply, it is too big.

---

## Determinism Over Cleverness

This platform favors:
- Explicit code
- Predictable behavior
- Clear data flow

It avoids:
- Implicit magic
- Overly clever abstractions
- Hidden coupling

Readable code beats clever code every time.

---

## AI Is a Collaborator, Not an Excuse

AI tools are expected to be used extensively.

However:
- AI does not excuse poor design
- AI does not bypass review
- AI does not introduce undocumented behavior

AI-generated code is held to the same standard as human-written code.

If you cannot explain what the code does, it does not ship.

---

## Every Change Is Observable

If you add behavior, you must add observability.

Rules:
- New logic must emit logs or events where appropriate
- AI behavior must be traceable
- Silent behavior is not acceptable

If something matters, it must be observable.

---

## Explicit Ownership Everywhere

Every piece of logic must have a clear owner:
- A service owns its domain
- A frontend owns its UX
- A package owns its abstraction
- A document owns its decisions

Shared ownership without clarity leads to decay.

---

## Configuration Over Forking

Variation should be handled through:
- Configuration
- Feature flags
- Tenant overrides

Not through:
- Forked code paths
- Copy-pasted services
- Client-specific hacks

Forking is a last resort and must be documented.

---

## Fail Fast, Fail Loud

Failures should:
- Happen early
- Be explicit
- Be observable
- Be actionable

Rules:
- Invalid states must throw errors
- Misconfiguration must block startup
- AI failures must surface clearly

Silent failure is the worst failure mode.

---

## Documentation Is Part of the Build

Documentation is not optional.

Rules:
- New services require documentation
- Behavioral changes require doc updates
- Architectural deviations require ADRs

If the docs are wrong, the system is unsafe.

---

## Compliance Is a Design Constraint

Regulated modes (for example HIPAA) are:
- Designed in
- Enforced by code
- Tested continuously

Compliance is not a toggle at the end.

If a feature cannot work under compliance constraints, it must be redesigned.

---

## Optimize for Solo and Small Teams

This system assumes:
- Few humans
- Heavy AI assistance
- High leverage
- Low tolerance for chaos

Everything should be:
- Understandable in isolation
- Automatable
- Testable without heroics

If something requires tribal knowledge, it is broken.

---

## What This Philosophy Rejects

This repository explicitly rejects:
- “We’ll clean it up later”
- “It’s just temporary”
- “AI generated it, so it’s fine”
- “We need this fast, ignore the rules”

These statements create long-term damage.

---

## Summary

The build philosophy is simple:

- Be explicit
- Respect the architecture
- Use AI responsibly
- Ship small, complete changes
- Make behavior observable
- Treat documentation as code

If everyone follows this philosophy, the system remains fast, safe, and scalable.