# Chat UI (Example Implementation)

> **Note**: This application is a Reference Implementation. It demonstrates how to build a Product Frontend that interacts with the Chat Agent service.

## Purpose
Product frontend for the Chat Agent service. This application provides a reference implementation for AI-driven chat interactions.

## Target Users
- Direct users of the Chat Agent
- Reference for client implementations

## Services Used
- `chat-agent`: Main backend service for conversations and message processing via `@starter/chat-agent-sdk`.

## Key Workflows
- Starting a new conversation
- Sending and receiving messages (including streaming)
- Viewing AI-generated drafts

## Auth and Tenant Assumptions
- Authenticated via session tokens
- Explicit tenant context required for all service calls

## Dev Instructions
```bash
pnpm dev
```

## Deployment Notes
- Standard Next.js deployment

## Compliance Notes
- AI output is always shown as a draft to ensure human-in-the-loop validation where necessary.
- No sensitive data (secrets/prompts) in the UI.
