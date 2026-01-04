# Chat Agent Service (Example Implementation)

> **Note**: This service is a Reference Implementation. It demonstrates the architecture and patterns for building an AI-driven domain service in the AI-platform-monorepo-starter ecosystem.

## Purpose
The Chat Agent Service is the primary entry point for all conversational AI interactions within the AI-platform-monorepo-starter platform. It manages the lifecycle of chat sessions, coordinates between the AI runtime and domain-specific tools, and ensures all interactions are policy-compliant and observable.

## Service Ownership
- **Domain**: Conversational interactions and session management.
- **Data**: Chat history, session metadata, and chat-specific user preferences.
- **Logic**: Message orchestration, context window management, and response streaming.

## Public API Overview
The service exposes a versioned API for:
- `POST /v1/chats`: Create a new chat session.
- `POST /v1/chats/:id/messages`: Send a message to a session and receive a (streamed) response.
- `GET /v1/chats/:id/history`: Retrieve message history for a session.
- `DELETE /v1/chats/:id`: Terminate a session.

## AI Capabilities
- **Context Awareness**: Leverages the shared AI runtime for long-term and short-term memory.
- **Tool Orchestration**: Proposes tool calls for domain-specific actions (e.g., booking, searching).
- **Schema Validation**: All AI outputs are validated against domain schemas before execution.

## Events Emitted
The service emits the following events:
- `chat.session.started`: When a new session is initialized.
- `chat.message.received`: When a user message is successfully processed.
- `chat.response.generated`: When an AI response is completed.
- `chat.tool.invoked`: When the AI agent requests a tool execution.

## Compliance Considerations
- **HIPAA**: All PHI in chat history is encrypted at rest and redacted before being sent to non-eligible AI providers.
- **Data Retention**: Chat history is retained according to tenant-specific policy (default 7 years for medical records).
- **Auditability**: Every AI decision and tool call is logged with full context for auditing.

## Backup and Recovery

- **Backup Scope**: 
  - Operational Domain Data: Chat history, session metadata, user preferences.
  - Configuration: AI runtime overrides and model selection metadata.
- **Backup Frequency**: 
  - Production: Daily full backup.
  - Staging: Daily.
- **Restore Procedure**: 
  - Owned by Chat Agent Service.
  - Supports point-in-time recovery for sessions.
  - Supports single-tenant data isolation during restore.

## Known Limitations
- Initial release supports text-only interactions.
- Max context window is limited by the underlying model provider (e.g., GPT-4o).
