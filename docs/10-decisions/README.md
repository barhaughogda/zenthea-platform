# Architectural Decision Records (ADRs)

## Purpose

This folder contains **Architectural Decision Records (ADRs)** for the platform.

ADRs document:
- Significant architectural decisions
- The context in which decisions were made
- Alternatives that were considered
- The tradeoffs involved
- The consequences of the decision

This folder answers the question:  
**“Why is the system designed this way?”**

---

## Why ADRs Matter

Architecture evolves over time.

Without written decisions:
- Context is lost
- Decisions are re-litigated
- Changes are made without understanding tradeoffs
- AI agents “simplify” things incorrectly
- Long-term integrity degrades

ADRs preserve architectural intent.

---

## What Requires an ADR

An ADR is required when a change:
- Affects system-wide architecture
- Introduces a new core pattern
- Removes or relaxes an existing constraint
- Makes a significant tradeoff (speed vs safety, flexibility vs clarity)
- Affects compliance, security, or data boundaries
- Changes how AI behavior is governed

If future-you might ask “why did we do this?”, write an ADR.

---

## What Does NOT Require an ADR

An ADR is not required for:
- Small refactors
- Bug fixes
- Local optimizations
- Cosmetic changes
- Implementation details that do not affect architecture

ADRs capture decisions, not code churn.

---

## ADR Lifecycle

ADRs follow a simple lifecycle:

1. Proposed
2. Accepted
3. Superseded (if replaced)
4. Deprecated (if no longer relevant)

ADRs are never deleted.  
They are historical records.

---

## ADR Numbering

ADRs are numbered sequentially:

adr-001-.md
adr-002-.md

Numbers are permanent.  
Titles should be descriptive and kebab-case.

---

## ADR Tone and Style

ADRs should be:
- Clear
- Direct
- Honest about tradeoffs
- Free of marketing language
- Written for humans and AI agents

This is engineering documentation, not persuasion.

---

## Using ADRs with AI Agents

AI agents must:
- Read relevant ADRs before proposing changes
- Respect constraints defined in accepted ADRs
- Propose new ADRs when introducing architectural changes

Ignoring ADRs is a violation of build guidelines.

---

## Summary

ADRs are the memory of the architecture.

They:
- Preserve intent
- Prevent accidental drift
- Enable safe evolution
- Align humans and AI

This folder is not optional. It is the system’s backbone.