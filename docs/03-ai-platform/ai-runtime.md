# AI Runtime

## Purpose

This document defines the canonical AI runtime used across the platform.

It specifies:
- How AI execution is structured
- How prompts are composed
- How tools are selected and invoked
- How memory is accessed
- How policy and safety are enforced
- How AI behavior is observed and evaluated

This document answers the question: **“How does AI actually run inside this system?”**

All AI-enabled services must implement this runtime or explicitly justify deviations.

---

## AI Runtime as a First-Class System Component

The AI runtime is not a library and not a thin wrapper around a model API.

It is a **first-class execution environment** that:
- Coordinates AI reasoning
- Governs access to data and tools
- Enforces policy
- Produces observable, auditable behavior

Services do not call models directly.  
They invoke the AI runtime.

---

## High-Level Execution Pipeline

Every AI execution follows the same canonical pipeline:

1. Input normalization
2. Context construction
3. Policy pre-checks
4. Memory retrieval
5. Prompt composition
6. Model invocation
7. Tool planning and execution
8. Output validation and post-processing
9. Policy post-checks
10. Persistence and event emission
11. Observability and evaluation hooks

No step may be skipped implicitly.

---

## Step 1: Input Normalization

Inputs to the AI runtime must be explicit and structured.

Responsibilities:
- Validate input shape and types
- Attach request metadata (tenant, user, correlation ID)
- Normalize free-form input into structured fields
- Reject malformed or ambiguous inputs early

AI must never receive raw, unvalidated input.

---

## Step 2: Context Construction

Context defines the scope of AI behavior.

Context includes:
- Tenant configuration
- User role and permissions
- Service-specific configuration
- Compliance mode (for example: HIPAA)
- Execution intent (what the AI is being asked to do)

Context must be explicit and immutable for the duration of execution.

---

## Step 3: Policy Pre-Checks

Before any AI reasoning occurs, policy is enforced.

Pre-checks may include:
- Authorization to perform the requested action
- Data access eligibility
- Vendor eligibility constraints
- Rate and budget limits

If a policy check fails, AI execution does not proceed.

---

## Step 4: Memory Retrieval

Memory provides historical or contextual information to the AI.

Memory sources may include:
- Conversation history
- Prior decisions
- Domain-specific state summaries
- User-provided context

Rules:
- Memory access is explicit and scoped
- Memory is retrieved through defined interfaces
- Sensitive data is filtered or redacted as required
- Memory size is constrained intentionally

Memory is input, not authority.

---

## Step 5: Prompt Composition

Prompt composition is deterministic and structured.

The runtime assembles prompts from:
- System instructions
- Domain-specific instructions
- Policy constraints
- Retrieved memory
- User or service input

Rules:
- Prompt templates are versioned
- Prompt assembly is logged
- No ad-hoc prompt construction is allowed
- Prompts must be reproducible given the same inputs

Prompt composition defines AI behavior more than model choice.

---

## Step 6: Model Invocation

Model invocation is abstracted behind a provider-agnostic interface.

Responsibilities:
- Select model based on context and configuration
- Apply temperature and sampling constraints
- Enforce token and cost limits
- Handle retries and timeouts

The runtime must support:
- Multiple providers
- Multiple model versions
- Seamless replacement of providers

Model calls are treated as unreliable external dependencies.

---

## Step 7: Tool Planning and Execution

AI may propose tool usage as part of its reasoning.

Tool execution follows a strict protocol:

1. AI proposes a tool call with structured arguments
2. The runtime validates the tool schema
3. Policy checks tool eligibility
4. The orchestration layer approves execution
5. The tool adapter executes the action
6. Results are returned to the AI runtime
7. Tool usage is logged and audited

AI may not invoke tools directly.

---

## Step 8: Output Validation and Post-Processing

AI outputs are validated before use.

Validation may include:
- Schema validation
- Type checking
- Content filtering
- Safety checks
- Domain rule enforcement

Post-processing may include:
- Formatting
- Redaction
- Enrichment
- Confidence scoring

Invalid outputs must be handled gracefully.

---

## Step 9: Policy Post-Checks

After AI execution, policy is enforced again.

Post-checks may include:
- Verification of allowed outputs
- Confirmation of data exposure rules
- Detection of policy violations

Policy violations must be logged and surfaced clearly.

---

## Step 10: Persistence and Event Emission

Only validated outcomes may affect system state.

Responsibilities:
- Persist approved results
- Emit relevant domain and AI events
- Update derived state where applicable

Speculative or intermediate AI outputs must not be persisted.

---

## Step 11: Observability and Evaluation Hooks

Every AI execution must be observable.

Required signals include:
- Prompt version and hash
- Model and provider used
- Tool calls and results
- Latency and cost metrics
- Policy decisions
- Output summaries

Evaluation hooks capture:
- Feedback signals
- Regression data
- Quality metrics

Observability is mandatory, not optional.

---

## Error Handling and Fallbacks

AI runtime failures must be handled explicitly.

Rules:
- Failures must not corrupt state
- Partial results must not be persisted
- Fallback behavior must be defined
- Errors must be observable and actionable

Graceful degradation is preferred over silent failure.

---

## Runtime Configuration

The AI runtime is configurable per:
- Service
- Tenant
- Environment

Configuration may include:
- Model selection
- Prompt versions
- Tool availability
- Cost and rate limits
- Compliance modes

Configuration changes must be auditable.

---

## Tool Proposals vs Tool Execution

The AI runtime distinguishes between:
- Tool proposals (AI output)
- Tool execution (system action)

AI output describing a tool action is treated as a proposal that must be:
- Validated
- Authorized
- Approved (where required)
- Executed by infrastructure code

AI agents never execute tools directly.

---

### Financial Action Constraints

The AI runtime enforces strict financial safety boundaries.

The AI runtime must:
- Reject any attempt to initiate payments
- Reject any attempt to modify billing state
- Reject any attempt to change plans or entitlements
- Treat monetisation-related outputs as proposals only

Financial execution is never delegated to AI.

---

## What the AI Runtime Does Not Do

The AI runtime does not:
- Own business rules
- Own persistent state
- Make final decisions without validation
- Bypass policy or compliance constraints

Those responsibilities belong elsewhere.

---

## Summary

The AI runtime is the controlled environment in which intelligence operates.

It ensures:
- Predictable execution
- Governed behavior
- Observable outcomes
- Safe integration with the rest of the system

All AI-enabled services must use this runtime as their foundation.