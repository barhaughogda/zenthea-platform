# Prompt Writing Guidelines

## Purpose

This document defines the concrete rules and best practices for writing prompts in this platform.

It explains:
- How to write clear, safe, and deterministic prompts
- How to avoid ambiguity and hallucination
- How to structure instructions and constraints
- How to write prompts that are testable and evolvable
- How humans and AI agents are expected to behave when authoring prompts

This document answers the question:  
**“How do we write prompts that behave reliably in production?”**

---

## Golden Rule

**If a prompt can be misunderstood, it will be.**

Write prompts as if:
- The model is highly capable but literal
- Input may be ambiguous or adversarial
- Outputs will be used in real systems
- Auditors may read this later

---

## Prompt Writing Principles

All prompts must follow these principles:

- Explicit over implicit
- Structured over conversational
- Deterministic over creative
- Defensive over optimistic
- Boring over clever

Creativity belongs in outputs, not in instructions.

---

## Use Clear, Direct Language

Do:
- Use simple sentences
- Use imperative verbs
- Use numbered steps where possible

Avoid:
- Vague language
- Metaphors
- Rhetorical phrasing
- “You should try to…”

Bad:
> “Try to analyze the input and give a good response.”

Good:
> “Analyze the input according to the rules below and return a structured response that matches the schema.”

---

## One Responsibility Per Prompt Layer

Each prompt layer must do exactly one job.

Rules:
- System layer defines identity only
- Policy layer defines constraints only
- Domain layer defines domain context only
- Task layer defines what to do now
- Memory layer provides historical context only

Never mix responsibilities across layers.

When proposing tool usage, prompts must:
- Describe actions declaratively
- Include sufficient detail for approval
- Never assume execution
- Never chain actions implicitly

---

## Always Define the Output Format

Every task prompt must specify:
- Output structure
- Allowed fields
- Required fields
- Data types where relevant

Preferred patterns:
- JSON schemas
- Bullet lists with strict headings
- Enumerated values

If output is not structured, it is not testable.

---

## Explicitly Define What NOT to Do

Prompts must include explicit prohibitions.

Examples:
- “Do not make assumptions beyond the provided data.”
- “Do not fabricate unknown values.”
- “Do not execute actions unless instructed.”

Models respect boundaries better when they are explicit.

---

## Avoid Hidden Instructions

Do not:
- Encode logic through implication
- Rely on “common sense”
- Assume the model knows platform conventions

Everything the model needs to behave correctly must be stated or passed as context.

---

## Use Step-by-Step Instructions

For complex tasks:
- Break the task into ordered steps
- Describe the expected reasoning at a high level
- Avoid asking for chain-of-thought explicitly

Example:
1. Validate the input.
2. Identify relevant entities.
3. Produce a structured recommendation.

Steps improve consistency without exposing internals.

---

## Be Defensive Against Input

Assume inputs may be:
- Incomplete
- Incorrect
- Malicious
- Conflicting

Prompts should instruct the model to:
- Ask for clarification when required
- Refuse unsafe or out-of-scope requests
- Flag uncertainty explicitly

Never assume input is trustworthy.

---

## Avoid Overloading Prompts

If a prompt is doing too much:
- Split it into multiple tasks
- Introduce intermediate orchestration steps
- Move logic into domain code

Large prompts that “handle everything” are brittle.

---

## Do Not Encode Business Logic in Prompts

Prompts must not:
- Enforce pricing rules
- Decide authorization
- Mutate state directly
- Replace domain validation
- Execute tools
- Assume tool execution
- Perform irreversible actions

Prompts propose. Code decides.
Prompts may propose tool usage, but must describe actions declaratively.

---

## Monetisation and Financial Safety Constraints

AI agents must never perform or assume financial actions.

Prompts must not:
- Initiate or execute payments
- Modify billing data
- Change plans, pricing, or entitlements
- Apply credits, refunds, or discounts
- Trigger irreversible financial actions
- Assume payment success or failure

AI agents may:
- Explain pricing or plans
- Summarize usage or cost implications
- Propose monetisation-related actions for human approval only

All monetisation-related actions require explicit system or human control.

---

## Avoid Model-Specific Tricks

Do not:
- Rely on undocumented model behavior
- Use prompt hacks that only work on one provider
- Encode provider-specific quirks

Prompts must survive model upgrades.

---

## Comments Are Encouraged

Prompts may include comments for humans.

Use comments to explain:
- Intent
- Constraints
- Known edge cases
- Why something is phrased a certain way

Readable prompts are maintainable prompts.

---

## Prompt Length Guidelines

Long prompts are allowed, but only if justified.

Rules:
- Remove redundant language
- Prefer references over repetition
- Summarize memory aggressively

If a prompt keeps growing, refactor the system.

---

## Naming and Versioning

Every prompt file must:
- Have a clear, descriptive name
- Include a version identifier
- Include a short purpose description

Never overwrite a prompt silently.

---

## Writing Prompts with AI Assistance

AI agents may:
- Draft prompts
- Suggest wording improvements
- Identify ambiguity
- Generate test cases

AI agents may not:
- Finalize prompts without review
- Introduce new authority
- Bypass guidelines

AI helps write prompts. Humans approve them.

---

## Prompt Review Checklist

Before approving a prompt, ask:
- Is the responsibility clear?
- Are constraints explicit?
- Is the output format unambiguous?
- Can this be tested deterministically?
- Could this cause unsafe behavior?

If any answer is “maybe,” revise.

---

## Common Prompt Smells

Refactor prompts that:
- Are overly conversational
- Contain vague encouragements
- Depend on implied knowledge
- Try to “outsmart” the model
- Break when input varies slightly

These smells indicate fragility.

---

## Summary

Great prompts are:
- Explicit
- Structured
- Defensive
- Testable
- Boring in the best way

Follow these guidelines and prompts become reliable system components instead of unpredictable magic.