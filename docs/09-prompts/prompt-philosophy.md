# Prompt Philosophy

## Purpose

This document defines the philosophy that governs how prompts are designed, written, reviewed, and evolved in this platform.

It explains:
- What a prompt is in this system
- What prompts are responsible for
- How prompts relate to code, policy, and configuration
- What behavior is acceptable and what is not

This document answers the question:  
**“What role do prompts play, and how do we treat them responsibly?”**

---

## Prompts Are System Components

In this platform, prompts are not:
- Ad-hoc strings
- Quick experiments
- Developer notes

Prompts are:
- First-class system components
- Inputs to deterministic workflows
- Part of the platform’s behavior surface
- Subject to review, testing, and versioning

A prompt change is a system change.

---

## Prompts Do Not Own Authority

Prompts influence behavior.  
They do not own authority.

Rules:
- Prompts propose, not decide
- Domain logic enforces truth
- Policy overrides prompt intent
- Configuration constrains prompt scope

If a prompt can bypass domain or policy rules, the system is broken.

---

## Separation of Concerns in Prompts

Prompts must be layered.

Each layer has a single responsibility:
- System: identity and role
- Policy: non-negotiable constraints
- Domain: domain context and rules
- Task: what to do now
- Memory: historical context
- Input: user or system input

Mixed concerns create brittle prompts.

---

## Determinism Over Creativity

Creativity is allowed.  
Unpredictability is not.

Rules:
- Prompts must aim for consistent structure
- Outputs must be schema-constrained
- Variability must be intentional and bounded

If output quality varies wildly, the prompt is poorly designed.

---

## Prompts Are Configuration-Driven

Prompts are selected and composed via configuration.

Rules:
- No hardcoded prompt strings in orchestration
- Prompt versions are selected explicitly
- Prompt changes do not require code changes

Prompts evolve independently from code.

---

## Prompts Are Auditable

Every prompt execution must be traceable.

Required properties:
- Prompt version
- Prompt hash
- Model and provider
- Tools available
- Policy context

If you cannot explain which prompt produced an output, the system is unsafe.

---

## Prompts Must Be Explainable

Prompts should be readable by:
- Humans
- AI agents
- Auditors

Rules:
- Plain language over clever tricks
- Explicit instructions over implication
- Comments are allowed and encouraged

If a prompt cannot be explained, it should not exist.

---

## Prompts Are Defensive

Prompts must assume:
- Ambiguous input
- Adversarial input
- Partial context
- Model imperfections

Rules:
- Guardrails are explicit
- Failure modes are anticipated
- Unsafe actions are refused

Prompts are not trusted. They are constrained.

---

## Prompts and Compliance

In regulated modes:
- Prompts must avoid sensitive data leakage
- Prompts must reinforce compliance behavior
- Prompts must not encourage speculation or hallucination

Compliance rules override prompt intent.

In GDPR modes, prompts must also:
- Avoid retaining personal data unless strictly required
- Prefer anonymized or summarized context
- Support data erasure and reprocessing workflows
- Treat memory as revocable, not permanent

---

## Prompts and AI Agents

AI agents may:
- Generate prompt drafts
- Suggest improvements
- Analyze prompt behavior

AI agents may not:
- Deploy prompt changes automatically
- Bypass prompt review
- Introduce undocumented prompt logic

AI assists prompt engineering. It does not own it.

---

## What This Philosophy Rejects

This platform explicitly rejects:
- One giant prompt that “does everything”
- Inline prompt hacking
- Prompt changes without review
- Prompt logic replacing domain logic
- “It works most of the time” prompts

These patterns do not scale.

---

## Summary

The prompt philosophy is simple:

- Treat prompts as system components
- Separate concerns clearly
- Keep authority in code and policy
- Make prompts auditable and explainable
- Version, test, and observe prompt behavior

If prompts are treated casually, the system will fail in subtle ways.