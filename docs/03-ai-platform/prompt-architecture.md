# Prompt Architecture

## Purpose

This document defines the prompt architecture used across the platform.

It explains:
- How prompts are structured and composed
- How prompts relate to services, models, and policies
- How prompts are versioned and evolved
- How prompt changes are tested and deployed safely

This document answers the question: **“How do we design prompts so AI behavior is predictable, testable, and reusable?”**

---

## Prompts as System Artifacts

Prompts are treated as first-class system artifacts.

This means:
- Prompts are designed deliberately
- Prompts are versioned
- Prompts are reviewed
- Prompts are tested
- Prompts are observable at runtime

Prompts are not ad-hoc strings embedded in code.

---

## Separation of Prompt Concerns

Prompts are composed from multiple layers, each with a specific responsibility.

This separation enables:
- Reuse across services
- Clear ownership
- Safe evolution
- Deterministic behavior

No single prompt should contain all logic.

---

## Prompt Layers

The canonical prompt architecture consists of the following layers:

1. System layer
2. Policy layer
3. Domain layer
4. Task layer
5. Memory layer
6. Input layer

Each layer is assembled deterministically at runtime.

---

### 1. System Layer

The system layer defines global behavior and constraints.

Responsibilities:
- Establish AI role and identity
- Define non-negotiable behavioral rules
- Enforce tone and output discipline
- Specify structured output expectations

The system layer is shared across services.

It changes rarely and is versioned carefully.

---

### 2. Policy Layer

The policy layer encodes compliance and safety constraints.

Responsibilities:
- Data handling rules
- Compliance modes (for example: HIPAA)
- Tool usage restrictions
- Output constraints

Policy prompts are injected automatically based on execution context.

Services must not bypass policy prompts.

---

### 3. Domain Layer

The domain layer defines domain-specific knowledge and rules.

Responsibilities:
- Domain vocabulary
- Domain constraints and invariants
- Domain-specific reasoning guidance

Each service owns its domain layer prompts.

Domain prompts must not encode UI or workflow logic.

---

### 4. Task Layer

The task layer defines what the AI is being asked to do in a specific execution.

Responsibilities:
- Explicit task definition
- Success criteria
- Allowed actions
- Expected output format

Task prompts are typically short-lived and context-specific.

---

### 5. Memory Layer

The memory layer injects historical or contextual information.

Responsibilities:
- Provide relevant prior context
- Summarize historical state
- Limit memory scope and size

Memory is always optional and scoped.

Memory must never override policy or domain constraints.

---

### 6. Input Layer

The input layer contains user or service-provided input.

Responsibilities:
- Provide raw task input
- Preserve original intent
- Avoid interpretation or transformation

Input is passed through normalization before inclusion.

---

## Prompt Composition Rules

Prompt composition follows strict rules:

- Layers are assembled in a fixed order
- Each layer is independently versioned
- The same inputs must produce the same prompt
- Prompt assembly must be observable and logged

Prompt composition logic lives in the AI runtime, not in services.

---

## Structured Outputs

Prompts should request structured outputs whenever possible.

Rules:
- Prefer JSON or schema-based outputs
- Define explicit fields and types
- Reject free-form output when structure is required

Structured outputs reduce ambiguity and improve safety.

---

## Prompt Versioning

Every prompt layer is versioned.

Versioning rules:
- Versions are immutable
- Breaking changes require new versions
- Version selection is explicit in configuration

Prompt versions are part of the AI execution metadata.

---

## Prompt Testing and Validation

Prompts must be tested.

Testing includes:
- Golden input/output pairs
- Schema validation
- Regression testing
- Failure mode testing

Prompt tests run alongside code tests.

Untested prompt changes are not allowed.

---

## Prompt Observability

Prompt usage must be observable.

At runtime, the system must be able to record:
- Prompt versions used
- Prompt layer composition
- Model and provider
- Output summaries
- Errors or policy violations

This data supports debugging, evaluation, and audits.

---

## Prompt Reuse and Composition

Prompt layers are designed for reuse.

Examples:
- A system layer reused across all services
- A policy layer reused across compliance modes
- A domain layer reused across tasks within a service

Duplication of prompt logic is discouraged.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Hardcoded prompt strings in service logic
- Prompt logic embedded in UI code
- Prompt changes without versioning
- Prompt changes without evaluation
- Overloaded prompts that mix unrelated concerns

These patterns lead to brittle and unsafe AI behavior.

---

## Summary

Prompt architecture is the foundation of AI behavior.

By separating concerns, enforcing versioning, and requiring observability, the platform ensures that:
- AI behavior is predictable
- Changes are safe
- Reuse is maximized
- Compliance is enforced

All AI-enabled services must follow this prompt architecture.