# Chat Agent SDK (`@starter/chat-agent-sdk`)

## Overview

The Chat Agent SDK provides a typed, versioned interface for interacting with the AI-platform-monorepo-starter Chat Agent service. It adheres to the platform's SDK principles:
- **Typed Contracts**: All requests and responses are validated via Zod.
- **No Business Logic**: Only handles transport, validation, and error normalization.
- **No AI Logic**: Does not perform prompt engineering or model calls.
- **Clear Error Handling**: Provides specific error classes for different failure modes.

## Installation

```bash
pnpm add @starter/chat-agent-sdk --workspace
```

## Usage

### Initialization

```typescript
import { ChatAgentClient } from '@starter/chat-agent-sdk';

const client = new ChatAgentClient({
  baseUrl: 'https://api.zenthea.com/chat',
  apiKey: process.env.CHAT_AGENT_API_KEY,
  // Or provide a token getter for OAuth/OIDC
  // getToken: async () => authProvider.getAccessToken(),
});
```

### Create a Conversation

```typescript
const conversation = await client.createConversation({
  tenantId: '<TENANT_ID>',
  metadata: { source: 'web-widget' },
  initialMessage: 'Hello, how can you help me today?'
});

console.log(`Created conversation: ${conversation.id}`);
```

### Send a Message (Blocking)

```typescript
const response = await client.sendMessage(conversationId, {
  content: 'What is the status of my order?',
});

console.log('AI Response:', response.content);
```

### Stream a Message

```typescript
const stream = client.streamMessage(conversationId, {
  content: 'Write a long poem about coding.',
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
  if (chunk.finishReason) {
    console.log(`\nFinished: ${chunk.finishReason}`);
  }
}
```

### Get History

```typescript
const { messages, nextCursor } = await client.getMessages(conversationId, {
  limit: 20
});
```

## Error Handling

The SDK throws specific error classes to help you handle failures gracefully:

- `ChatAgentClientError`: 4xx errors (e.g., validation failed, unauthorized).
- `ChatAgentServerError`: 5xx errors (e.g., service unavailable).
- `ChatAgentValidationError`: Failed to validate the API response against the local schema.
- `ChatAgentNetworkError`: Connectivity or timeout issues.

```typescript
try {
  await client.sendMessage(id, { content: '' });
} catch (error) {
  if (error instanceof ChatAgentClientError) {
    console.error('User error:', error.message, error.details);
  } else if (error instanceof ChatAgentServerError) {
    console.error('Service is down');
  }
}
```

## Guarantees

1. **Versioned Interface**: Matches the Chat Agent service API v0.1.0.
2. **Strict Validation**: All incoming data is validated before reaching your application code.
3. **Tenant Aware**: Designed for multi-tenant environments.
4. **Platform Standards**: Follows AI-platform-monorepo-starter's naming and architectural conventions.
