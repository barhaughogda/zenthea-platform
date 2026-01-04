# ADR-003: AI Runtime Abstraction

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is explicitly **AI-first**.

AI is used across:
- Multiple backend services
- Multiple business domains
- Multiple client configurations
- Regulated and non-regulated environments

The system must support:
- Multiple model providers
- Rapid model evolution
- Prompt versioning and governance
- Tool execution with policy enforcement
- Observability, cost control, and evaluation
- Compliance constraints (for example HIPAA)

A decision was required on **how AI capabilities are accessed**:
- Direct model calls in services
- Provider-specific SDK usage
- Or a unified, abstracted AI runtime

Without abstraction, AI usage becomes fragmented, unsafe, and unmaintainable.

---

## Decision

All AI interactions must go through a **shared AI runtime abstraction**.

Services:
- Do not call model providers directly
- Do not embed provider-specific logic
- Do not manage retries, fallbacks, or policy enforcement themselves

The AI runtime is the **single integration point** for:
- Model invocation
- Prompt composition
- Tool exposure
- Policy enforcement
- Cost and rate limiting
- Observability and evaluation hooks

Direct model access from services is explicitly disallowed.

---

## Rationale

This decision was made for the following reasons:

---

### 1. Provider Independence

Model providers evolve rapidly.

An abstraction allows:
- Switching providers without rewriting services
- Using multiple providers simultaneously
- Adopting new models safely

This protects the platform from vendor lock-in.

---

### 2. Centralized Governance

AI behavior must be governed centrally.

A shared runtime enforces:
- Prompt architecture and layering
- Policy and compliance rules
- Tool permission boundaries
- Consistent refusal and fallback behavior

Without a runtime, governance fragments immediately.

---

### 3. Safer AI Tooling

Tools represent real system capabilities.

The runtime:
- Exposes tools explicitly
- Validates tool inputs and outputs
- Logs tool usage
- Enforces policy before execution

This prevents AI from bypassing system controls.

---

### 4. Observability and Cost Control

AI usage must be observable.

The runtime:
- Captures token usage and cost
- Emits structured traces
- Records prompt versions and hashes
- Enables per-tenant budgets and limits

This is impossible to enforce consistently with direct model calls.

---

### 5. Testing and Evaluation

AI behavior must be testable.

The runtime:
- Enables deterministic evaluation harnesses
- Supports golden tests and regression detection
- Standardizes AI invocation across services

Testing AI without a runtime leads to brittle, ad-hoc setups.

---

### 6. Compliance by Design

In regulated environments:
- Providers must be approved
- Prompts must avoid sensitive data leakage
- Logging must be controlled
- Behavior must be auditable

A centralized runtime is the only practical enforcement point.

---

### 7. Tool Proposal and Execution Boundary

AI agents may only propose tool actions.

All tool proposals:
- Are declarative
- Are validated by the AI runtime
- Are classified by risk
- Require explicit approval unless explicitly auto-approved
- Are executed by infrastructure, not AI

Tool execution is never performed directly by AI agents.

---

## What the AI Runtime Owns

The AI runtime owns:
- Model selection and invocation
- Prompt composition from layered templates
- Tool registration and execution mediation
- Policy enforcement
- Cost and rate limiting
- Telemetry emission
- Evaluation hooks

The runtime does not own domain logic.

---

## What Services Own

Services:
- Define domain-specific prompts
- Declare which tools are available
- Validate AI outputs
- Apply domain rules
- Decide how AI output is used
- Mediation of AI-proposed tool actions, including validation, approval, and execution routing

Services consume AI. They do not implement AI infrastructure.

---

### Tool Usage Model

AI agents may propose tool actions, but may not execute tools directly.

All tool usage:
- Is declared explicitly
- Is validated against policy and compliance rules
- Is executed by the system, not the AI
- Is fully observable and auditable

External tool execution may be delegated to orchestration systems (for example n8n), but only through controlled interfaces.

---

## Alternatives Considered

### Alternative 1: Direct Model Calls in Services

**Description**
- Each service integrates directly with model SDKs

**Why it was rejected**
- Leads to duplicated logic
- Makes governance inconsistent
- Increases security and compliance risk
- Makes provider switching expensive

This approach does not scale.

---

### Alternative 2: Thin Helper Library

**Description**
- Minimal wrapper around provider SDKs

**Why it was rejected**
- Insufficient for governance
- Does not enforce prompt architecture
- Does not centralize policy or observability

AI infrastructure requires more than syntactic sugar.

---

### Alternative 3: External AI Gateway Service

**Description**
- Separate microservice responsible for all AI

**Why it was rejected**
- Introduces network latency
- Increases operational complexity
- Complicates local development
- Provides little benefit over an in-process runtime

Abstraction does not require network boundaries.

---

## Consequences

### Positive Consequences

- Strong AI governance
- Safer automation
- Easier testing and iteration
- Provider flexibility
- Predictable cost control

---

### Negative Tradeoffs

- Slight upfront complexity
- Requires discipline to enforce usage
- Runtime must be well-designed

These tradeoffs are intentional and acceptable.

---

## Compliance and Security Impact

- Central enforcement of compliance rules
- Approved provider allowlists
- Consistent audit logging
- Reduced risk of accidental data exposure

This decision significantly strengthens compliance posture.

---

## AI and Automation Impact

- Enables prompt governance
- Enables safe tool usage
- Enables evaluation-driven development
- Prevents AI behavior fragmentation

This ADR is foundational to the platform’s AI-first strategy.

---

## Implementation Notes

- The AI runtime is a shared package
- Runtime APIs are stable and versioned
- Services interact via a narrow interface
- Violations are blocked in code review and CI

Direct model usage is treated as a defect.

---

## Related Documents

- `/docs/09-prompts/prompt-architecture.md`
- `/docs/08-build-guidelines/ai-integration-guide.md`
- `/docs/07-devops/observability.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR intentionally centralizes AI complexity to simplify everything else.