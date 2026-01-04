# Eventing Model

## Purpose

This document defines the eventing model used across the platform.

It explains:
- Why events exist in this system
- What constitutes an event
- How events are produced and consumed
- How event schemas are governed and evolved
- How events interact with AI, policy, and observability

This document answers the question: **“How does the system communicate asynchronously without introducing tight coupling?”**

---

## Why Events Exist

Events are used to decouple services while enabling coordination.

They allow the system to:
- React to changes without synchronous dependencies
- Scale independently across services
- Introduce new behaviors without modifying existing producers
- Capture important system activity for audit, analytics, and evaluation

Events are not used to replace APIs.  
They complement APIs where asynchronous behavior is appropriate.

---

## Definition of an Event

An event is a **fact** that something has occurred in the system.

An event:
- Represents something that already happened
- Is immutable once published
- Is timestamped
- Has a clear producer
- Has a versioned schema

Events do not represent commands or requests.  
They represent outcomes.

---

## Event Producers

A service is an event producer when it emits events about its own domain.

Rules for producers:
- A service may only emit events about data it owns
- A service must not emit events on behalf of another service
- Events are emitted after the relevant state change is committed
- Events must reflect actual outcomes, not intentions

Examples of producer responsibilities:
- A chat service emits a `conversation.completed` event
- A sales service emits a `lead.status_changed` event
- An AI service emits an `ai.decision_recorded` event

---

## Event Consumers

Services, workflows, or internal pipelines may consume events.

Rules for consumers:
- Consumers must not assume they are the only consumer
- Consumers must tolerate duplicate events
- Consumers must tolerate out-of-order delivery
- Consumers must handle schema evolution gracefully

Consumers must treat events as advisory signals, not guaranteed triggers.

---

## Event Schema Design

Event schemas must be explicit and versioned.

Each event schema must define:
- Event name
- Version
- Producer service
- Timestamp
- Correlation and causation identifiers
- Payload structure
- Data classification (for compliance)

Schemas should favor:
- Explicit fields over nested ambiguity
- Stable identifiers
- Forward-compatible design

Breaking schema changes require a new version.

---

## Event Naming Conventions

Event names follow a consistent pattern:

Examples:
- `chat.conversation.started`
- `chat.message.created`
- `sales.lead.updated`
- `ai.tool.invoked`

Names describe what happened, not what should happen.

---

## Event Flow Lifecycle

A typical event lifecycle follows these steps:

1. A service completes a state change
2. The service records the change durably
3. The service emits an event describing the change
4. The event is published to the event infrastructure
5. Consumers receive and process the event asynchronously
6. Observability systems record delivery and processing outcomes

Event emission must not block core service execution.

---

## Idempotency and Delivery Guarantees

The eventing model assumes **at-least-once delivery**.

Implications:
- Producers may emit duplicate events
- Consumers must implement idempotent handling
- Side effects must be guarded against duplication

Exactly-once semantics are not assumed.

Idempotency keys and correlation IDs are required for safe processing.

---

## Event Ordering

Consumers must not rely on strict ordering unless explicitly documented.

Rules:
- Ordering may be preserved within a single entity stream
- Global ordering is not guaranteed
- Consumers must handle out-of-order events

If strict ordering is required, it must be enforced at the consumer level.

---

## Events and AI Behavior

Events play a key role in AI-related workflows.

AI-relevant events may include:
- AI decision completion
- Tool invocation results
- Policy violations
- Evaluation outcomes
- Feedback ingestion

AI systems may consume events to:
- Trigger background reasoning
- Update derived state
- Feed evaluation and learning pipelines

AI systems must never act on events without applying policy checks.

---

## Policy and Compliance Considerations

Events are subject to the same policy constraints as other data flows.

Rules:
- Events must not include unnecessary sensitive data
- PHI must be redacted or encrypted when applicable
- Events must be auditable
- Retention policies must be defined per event type

Compliance-sensitive events must be classified explicitly.

---

## Observability and Traceability

All events must be observable.

Required properties:
- Correlation ID linking events to requests and other events
- Producer identity
- Timestamp and version
- Delivery and processing metrics

Events form a critical part of the system’s audit and debugging capabilities.

---

## Event Infrastructure Abstraction

The platform does not mandate a specific eventing technology.

Instead:
- Event publishing and consumption are abstracted behind interfaces
- Infrastructure can be replaced without changing producers or consumers
- Vendor-specific features are avoided in core logic

This abstraction enables portability and long-term flexibility.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Using events as commands
- Emitting events before state is committed
- Relying on events for synchronous workflows
- Embedding business logic in event handlers without orchestration

Violating these patterns leads to brittle systems.

---

## Summary

The eventing model enables asynchronous communication without sacrificing clarity or safety.

Events represent facts.
Services emit events about their own domain.
Consumers react defensively and idempotently.
AI systems consume events within policy constraints.

This model supports scalability, observability, and compliance while preserving clear service boundaries.