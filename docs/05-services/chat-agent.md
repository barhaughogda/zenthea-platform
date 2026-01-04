# Chat Agent Service

## Purpose

The Chat Agent is a domain-specific AI service responsible for conversational interactions.

It provides:
- Structured, policy-governed conversations
- Tool-assisted task execution through dialogue
- Memory-aware responses within defined scopes
- Streaming and non-streaming interaction modes

This document answers the question: **“How do we implement conversational AI as a reliable, composable service?”**

---

## Domain Definition

### Domain Scope

The Chat Agent owns:
- Conversations and messages
- Conversation state and lifecycle
- Conversational AI behavior
- Conversation-scoped memory and summaries

The Chat Agent does not own:
- Business logic of other domains
- Cross-service workflows
- UI behavior
- Long-term authoritative user data

---

## Core Responsibilities

The Chat Agent must:
- Accept and validate conversational input
- Maintain conversation context safely
- Invoke the shared AI runtime for responses
- Support streaming responses
- Enforce policy and compliance constraints
- Emit events for conversation activity
- Provide observability into AI behavior

---

## API Surface

### Key Endpoints

Typical endpoints include:

- `POST /conversations`
  - Create a new conversation
- `POST /conversations/{id}/messages`
  - Append a user message and generate a response
- `GET /conversations/{id}`
  - Retrieve conversation metadata
- `GET /conversations/{id}/messages`
  - Retrieve message history (scoped and paginated)
- `POST /conversations/{id}/stream`
  - Stream AI responses

All endpoints must:
- Be tenant-aware
- Validate input strictly
- Support idempotency where applicable

---

## Conversation Lifecycle

A conversation progresses through defined stages:

1. Created
2. Active
3. Summarized (optional)
4. Archived or closed

State transitions are explicit and validated by domain logic.

---

## Internal Structure

The Chat Agent follows the canonical service structure:

/services/chat-agent
/api
/orchestration
/domain
/ai
/data
/integrations
/config
/tests
README.md

---

## Layer Responsibilities

### API Layer (`/api`)

Responsibilities:
- Expose conversation endpoints
- Validate request payloads
- Extract authentication and tenant context
- Initiate streaming when requested

Rules:
- No AI calls
- No state mutation beyond orchestration calls

---

### Orchestration Layer (`/orchestration`)

Responsibilities:
- Coordinate conversation workflows
- Apply policy pre- and post-checks
- Invoke the AI runtime
- Manage streaming sessions
- Persist validated outcomes
- Emit conversation events

This layer defines conversational behavior.

---

### Domain Layer (`/domain`)

Responsibilities:
- Conversation and message models
- State transition rules
- Validation of conversation invariants
- Message ordering guarantees

Domain logic must be deterministic and testable without AI.

---

### AI Layer (`/ai`)

Responsibilities:
- Define chat-specific prompt layers
- Specify allowed tools per context
- Invoke the shared AI runtime
- Parse and validate AI responses

Rules:
- No direct model calls
- No persistence
- No business logic

---

### Data Layer (`/data`)

Responsibilities:
- Conversation and message persistence
- Conversation summaries
- Encryption and redaction at rest
- Query optimization and pagination

Rules:
- Conversation data is tenant-scoped
- Retention policies apply

---

### Integrations Layer (`/integrations`)

Responsibilities:
- Optional external integrations (for example: CRM context)
- Webhook publishing for conversation events

All integrations must be policy-aware.

---

## AI Behavior Specification

### Prompt Architecture

The Chat Agent uses layered prompts:

- System layer: global conversational rules
- Policy layer: compliance and safety constraints
- Domain layer: conversational norms and capabilities
- Task layer: response generation
- Memory layer: scoped conversation context
- Input layer: user message

Prompt versions are explicit and observable.

---

### Tool Availability

Tools may include:
- Search or retrieval tools
- Domain-specific action tools (via other services)
- Summarization tools

Tool availability depends on:
- Tenant configuration
- User role
- Compliance mode

---

## Memory Strategy

The Chat Agent uses:
- Ephemeral memory for per-message reasoning
- Conversational memory for recent context
- Summarized memory for long conversations

Rules:
- Memory is scoped per conversation
- Memory is size-limited
- Summaries replace raw history over time

---

## Streaming Behavior

The Chat Agent supports streaming responses.

Rules:
- Policy checks occur before streaming begins
- Partial outputs are filtered if needed
- Streaming failures are handled gracefully
- Final outputs are validated and persisted

Streaming does not bypass compliance or observability.

---

## Event Emission

The Chat Agent emits events such as:
- `chat.conversation.created`
- `chat.message.received`
- `chat.message.generated`
- `chat.conversation.summarized`
- `chat.conversation.closed`

Events follow the eventing model and are schema-versioned.

---

## Observability

Required telemetry includes:
- Conversation and message IDs
- Prompt versions
- Model and provider used
- Tool calls and outcomes
- Token usage and latency
- Policy decisions

AI behavior must be traceable end-to-end.

---

## Security and Compliance

The Chat Agent must:
- Enforce authentication and authorization
- Respect tenant isolation
- Apply HIPAA mode when enabled
- Redact PHI when required
- Prevent prompt injection and data leakage

Security is enforced at every boundary.

---

## Testing and Evaluation

The Chat Agent must include:
- Domain unit tests for conversation logic
- API integration tests
- Prompt and output schema tests
- Streaming behavior tests
- Regression tests using golden conversations

AI tests must be deterministic and repeatable.

---

## Known Constraints and Non-Goals

The Chat Agent intentionally does not:
- Implement business workflows
- Store long-term user profiles
- Replace domain-specific services
- Make irreversible decisions autonomously

Its role is conversational orchestration, not authority.

---

## Summary

The Chat Agent is a foundational AI service that:
- Enables reliable conversational interaction
- Integrates AI safely and observably
- Composes with other services through tools and events
- Scales across tenants and use cases

It serves as the reference implementation for AI-driven services in this platform.