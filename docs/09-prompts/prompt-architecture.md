# Prompt Architecture

## Purpose

This document defines the canonical architecture for prompts in the platform.

It explains:
- How prompts are structured and layered
- What each layer is responsible for
- How layers are composed at runtime
- How prompts integrate with policy, configuration, and AI runtime
- How consistency is enforced across services

This document answers the question:  
**“What does a correct prompt look like in this system?”**

---

## Prompts as Layered Systems

All prompts in this platform are **layered systems**, not monolithic strings.

Each layer:
- Has a single responsibility
- Is independently versioned
- Can be composed or replaced
- Is selected via configuration

Prompt composition is deterministic and explicit.

---

## Canonical Prompt Layers

Every prompt may include the following layers, in this exact order:

1. System Layer
2. Policy Layer
3. Domain Layer
4. Task Layer
5. Memory Layer (optional)
6. Input Layer

Layers must never be reordered.

---

## 1. System Layer

### Responsibility

Defines the identity, role, and behavioral posture of the AI.

### Contains

- Role definition
- Tone and style constraints
- High-level behavior expectations
- Explicit refusal of out-of-scope actions

### Rules

- Never references a specific task
- Never references user input
- Rarely changes

The system layer defines *who the AI is*, not what it is doing.

---

## 2. Policy Layer

### Responsibility

Defines **non-negotiable constraints**.

### Contains

- Safety rules
- Compliance rules
- Legal and regulatory constraints
- Explicit refusals and escalation paths

### Rules

- Cannot be overridden by other layers
- Always present in regulated modes
- Selected by configuration

Policy beats everything else.

---

## 3. Domain Layer

### Responsibility

Defines domain-specific context and constraints.

### Contains

- Domain definitions
- Terminology
- Allowed and disallowed actions
- Domain invariants and assumptions

### Rules

- Service-specific
- Deterministic
- No task instructions

The domain layer defines *what world the AI is operating in*.

---

## 4. Task Layer

### Responsibility

Defines the **current task** to be performed.

### Contains

- Clear task description
- Step-by-step expectations
- Output format instructions
- Success criteria

### Rules

- Task-specific
- Short-lived
- Highly explicit

This layer answers *what should happen now*.

---

## 5. Memory Layer (Optional)

### Responsibility

Provides relevant historical context.

### Contains

- Prior decisions
- Conversation summaries
- User preferences
- Previous AI outputs (summarized)

### Rules

- Must be curated
- Must be scoped
- Must avoid raw logs or sensitive data

Memory enhances reasoning, but is never authoritative.

---

## 6. Input Layer

### Responsibility

Provides raw input to the task.

### Contains

- User input
- System input
- External signals

### Rules

- Must be clearly delimited
- Must not be trusted blindly
- Must be validated by orchestration

Input is data, not instruction.

---

## Prompt Composition Rules

Prompts are composed dynamically at runtime.

Rules:
- Layers are selected explicitly
- Versions are pinned
- Composition order is fixed
- Composition is observable

Example composition flow:
1. Load system prompt v1
2. Load policy prompt based on compliance mode
3. Load domain prompt for service
4. Load task prompt for operation
5. Load memory summary (if enabled)
6. Append raw input

---

## Versioning Model

Each layer is versioned independently.

Rules:
- Version changes are explicit
- Version selection is configuration-driven
- Multiple versions may coexist
- Rollback must be possible

Prompt version drift is a defect.

---

## Prompt Storage and Location

Prompts live in:

/docs/09-prompts/prompt-templates/

Each layer has its own directory.

Example:

prompt-templates/
system/
policy/
domain/
task/
memory/

No prompts live in code.

---

## Prompt Composition Ownership

Ownership is split:

- AI runtime: composition mechanics
- Service AI layer: prompt selection
- Configuration: version selection
- Policy engine: constraint enforcement

No single layer owns everything.

---

## Prompt and Tool Interaction

Prompts may reference tools, but must not:
- Execute tools directly
- Assume tool success
- Skip tool validation

Tools are exposed explicitly by the AI runtime.

---

## Observability Requirements

Each prompt execution must record:
- Layer versions
- Layer hashes
- Model and provider
- Tools available
- Correlation ID

Prompt observability is mandatory.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- One giant prompt
- Inline prompt strings in code
- Mixed policy and task logic
- Implicit prompt selection
- Prompt behavior that bypasses validation

These patterns destroy reliability.

---

## Summary

The prompt architecture ensures that:
- Prompts are modular and reusable
- Behavior is explainable and auditable
- Policy and compliance are enforceable
- AI behavior is predictable and evolvable

Every prompt in the system must follow this architecture.