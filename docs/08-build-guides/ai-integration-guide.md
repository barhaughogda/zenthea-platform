# AI Integration Guide

## Purpose

This document provides a step-by-step guide for integrating AI into services in this monorepo.

It explains:
- When AI should be used
- Where AI logic is allowed to live
- How to integrate with the shared AI runtime
- How to expose tools safely
- How to test, observe, and evolve AI behavior

This document answers the question:  
**“How do I add AI here without creating an ungoverned system?”**

---

## When to Use AI

AI should be used when it provides clear leverage.

Good use cases:
- Reasoning over ambiguous input
- Classification and scoring
- Summarization and explanation
- Recommendation and planning support
- Natural language interaction

Do not use AI for:
- Deterministic business rules
- Authorization or access control
- Financial or legal truth
- State mutation without validation

If correctness is mandatory, AI must be advisory only.

---

## Where AI Is Allowed to Live

AI integration is allowed **only** in the `/ai` layer of a service.

Rules:
- No AI calls in `/api`
- No AI calls in `/domain`
- No AI calls in `/data`
- No AI calls in frontends

All AI execution is coordinated via orchestration.

This is non-negotiable.

---

## High-Level Integration Flow

A correct AI integration follows this flow:

1. API receives intent
2. Orchestration validates and prepares context
3. AI layer defines prompts and tools
4. Orchestration invokes the AI runtime
5. AI proposes outputs or actions
6. Orchestration validates outputs
7. Domain logic enforces invariants
8. Approved outcomes are persisted
9. Events and telemetry are emitted

AI never bypasses orchestration or domain rules.

---

## Step 1: Define the AI Use Case Clearly

Before writing code, answer:
- What decision or output is AI providing?
- What inputs does it need?
- What outputs are expected?
- What is the failure mode?
- What happens if AI is unavailable?

Document this in the service README.

If you cannot answer these questions, do not integrate AI yet.

---

## Step 2: Define Prompt Layers

All prompts must follow the platform prompt architecture.

Required layers:
- System layer
- Policy layer
- Domain layer
- Task layer
- Memory layer (optional)
- Input layer

Rules:
- Prompts are composed, not concatenated
- Prompt templates are versioned
- Prompt logic is deterministic

Never embed prompts directly in orchestration code.

---

## Step 3: Declare Tools Explicitly

If AI needs to act, it must use tools.

Actions:
- Define tool schemas (inputs and outputs)
- Assign permissions and policy constraints
- Register tools with the AI runtime

Rules:
- One tool = one capability
- Tools must be idempotent where possible
- Tools must be observable
- AI proposes tool calls; it does not execute them directly

Tools are contracts. Treat them as such.

---

## Step 4: Invoke the AI Runtime

AI runtime invocation must:
- Pass explicit context
- Select model via configuration
- Include prompt versions
- Enforce cost and rate limits

Rules:
- No direct model SDK usage
- No hardcoded model names
- No hidden retries or fallbacks

The runtime owns reliability and safety.

---

## Step 5: Validate AI Outputs

All AI outputs must be validated.

Validation may include:
- Schema validation
- Domain rule checks
- Policy enforcement
- Safety filters
- Confidence thresholds

Rules:
- Invalid output is rejected
- Partial output is not persisted
- Failures must be observable

AI output without validation is a bug.

---

## Step 6: Apply Domain Authority

Domain logic is authoritative.

Rules:
- Domain invariants override AI output
- AI suggestions may be ignored or modified
- Domain logic must be deterministic

AI assists decisions. It does not make them.

---

## Step 7: Handle Failures Gracefully

AI failures must be expected.

Failure modes include:
- Model unavailability
- Timeout
- Tool failure
- Low-confidence output
- Policy violation

Rules:
- Define fallback behavior explicitly
- Surface failures clearly
- Never silently degrade correctness

Graceful degradation beats hidden errors.

---

## Step 8: Add Observability

Every AI integration must emit telemetry.

Required signals:
- Prompt version and hash
- Model and provider
- Token usage and cost
- Tool calls and outcomes
- Latency and errors
- Policy decisions

If you cannot trace AI behavior, it is unsafe.

---

## Step 9: Add AI Evaluation Tests

AI behavior must be tested.

Required tests:
- Golden input/output tests
- Schema compliance tests
- Regression tests
- Policy violation tests

Rules:
- Tests must be deterministic
- Evaluation thresholds must be explicit
- Regressions block promotion

AI without evaluation is technical debt.

---

## Step 10: Consider Compliance Modes

If the service supports regulated modes:
- Confirm PHI or sensitive data handling
- Ensure approved vendors only
- Apply prompt redaction rules
- Verify logging and retention constraints

Compliance rules override AI capability.

---

## Step 11: Document Everything

Update:
- Service README
- Prompt documentation
- Tool documentation
- ADRs if introducing new patterns

Undocumented AI behavior is not allowed.

---

## Common Failure Modes

Avoid these mistakes:
- Letting AI mutate state directly
- Embedding prompts in code
- Calling models directly
- Treating AI output as truth
- Skipping validation
- Skipping evaluation

These failures create systemic risk.

---

## Summary

To integrate AI correctly:

- Use AI only where it provides leverage
- Keep AI isolated in the AI layer
- Use the shared runtime
- Validate everything
- Make behavior observable
- Test and evaluate continuously
- Respect compliance constraints

Follow this guide and AI becomes a controlled asset, not a liability.