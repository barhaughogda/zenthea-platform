# Zenthea North Star
**Status**: Canonical, Strategic, Non-Temporal

This document defines Zenthea’s immutable long-term direction, independent of current implementation state, product phase, or the capabilities of any specific model or system.

## Purpose of the North Star
Zenthea exists to help healthcare teams deliver better care with less friction while preserving trust, safety, and clinical responsibility. It is designed to enable human-first AI that supports clinicians and operators without obscuring accountability.

This is **not** a roadmap and **not** a feature list. It is the stable reference point used to judge whether any execution, product decision, or technical design is directionally correct.

## The Core Problem Zenthea Solves
Healthcare delivery is constrained by:

- Fragmentation across systems and workflows that forces humans to reconcile context manually.
- Unsafe or opaque AI assistance that can produce plausible output without dependable grounding or accountability.
- Administrative overload on clinicians and care teams that reduces time for patients and increases error risk.
- Loss of patient trust when automation acts without clear provenance, oversight, or recourse.

Zenthea’s role is to reduce fragmentation and burden while increasing clarity, traceability, and safety in every AI-assisted step.

## Zenthea’s Fundamental Principles
- **Safety before capability**: If a system cannot operate safely, it should not operate at all.
- **Read-only before execution**: Observation, summarization, and drafting precede any action that changes state.
- **Human authority is never removed**: Humans can always review, override, and decline; no workflow removes accountable decision-making from people.
- **Deterministic systems over probabilistic control**: Use probabilistic models for understanding and drafting; use deterministic controls for permissions, state changes, and enforcement.
- **Auditability as a first-class feature**: Actions and recommendations must be attributable, reviewable, and explainable with durable records.
- **Clinical responsibility remains with humans**: Zenthea supports clinical work; it does not assume clinical liability or replace professional judgment.

## What Zenthea Is (Positive Definition)
Zenthea is:

- A governed AI platform for healthcare.
- An assistant, not an autonomous actor.
- A system that integrates into real workflows (EHR, patient portals, operational tooling) rather than requiring users to leave their clinical context.
- A platform that scales trust—through governance, traceability, and safe interfaces—not just intelligence.

## What Zenthea Is Not (Explicit Non-Goals)
Zenthea is not:

- An autonomous medical decision-maker.
- A chatbot pretending to be a clinician or presenting itself as an accountable provider.
- A black-box AI where outputs cannot be traced to inputs, policies, or reviewable reasoning.
- A growth-at-all-costs AI startup optimizing engagement over safety and responsibility.

## Long-Term Direction (10-Year View, Abstract)
Over the long term, Zenthea should become an ambient clinical co-pilot that supports care delivery across environments and roles:

- Voice-first and multimodal interaction to reduce documentation burden and improve accessibility.
- Deep integration across patient, clinician, and operator surfaces to reduce fragmentation and repeated work.
- Execution only within strictly governed, reversible, and auditable envelopes, where the system’s authority is explicitly bounded and continuously enforced.

The goal is not maximal automation; the goal is dependable assistance that increases safety, efficiency, and trust.

## Relationship to Execution and Phases
All execution phases (demo, governance, sandbox, execution) must align with this North Star. Phase boundaries may change, implementation details will evolve, and capabilities will expand—but the principles and non-goals here do not.

If a proposed feature conflicts with this document, **the feature is wrong**.

## Authority and Change Control
This document may only be changed deliberately. Changes require explicit discussion and intentional commit messages that clearly describe the rationale for altering the North Star.

Accidental drift is not acceptable.
