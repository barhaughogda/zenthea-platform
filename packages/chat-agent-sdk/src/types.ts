import { z } from 'zod';

/**
 * Message Roles in a conversation
 */
export const MessageRoleSchema = z.enum(['system', 'user', 'assistant']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

/**
 * Metadata for messages and conversations
 */
export const MetadataSchema = z.record(z.string(), z.unknown());
export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * A single message in a conversation
 */
export const MessageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.string().datetime(),
  metadata: MetadataSchema.optional(),
});
export type Message = z.infer<typeof MessageSchema>;

/**
 * Conversation Status
 */
export const ConversationStatusSchema = z.enum([
  'created',
  'active',
  'summarized',
  'archived',
  'closed',
]);
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>;

/**
 * A conversation session
 */
export const ConversationSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string(),
  status: ConversationStatusSchema,
  metadata: MetadataSchema.optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Conversation = z.infer<typeof ConversationSchema>;

/**
 * Create Conversation Request
 */
export const CreateConversationRequestSchema = z.object({
  tenantId: z.string(),
  metadata: MetadataSchema.optional(),
  initialMessage: z.string().optional(),
});
export type CreateConversationRequest = z.infer<typeof CreateConversationRequestSchema>;

/**
 * Create Message Request
 */
export const CreateMessageRequestSchema = z.object({
  content: z.string().min(1),
  metadata: MetadataSchema.optional(),
  stream: z.boolean().optional(),
});
export type CreateMessageRequest = z.infer<typeof CreateMessageRequestSchema>;

/**
 * Stream Chunk for AI responses
 */
export const StreamChunkSchema = z.object({
  id: z.string(),
  delta: z.string(),
  finishReason: z.enum(['stop', 'length', 'tool_calls', 'content_filter']).nullable(),
  metadata: MetadataSchema.optional(),
});
export type StreamChunk = z.infer<typeof StreamChunkSchema>;

/**
 * Conversation History Response
 */
export const ConversationHistorySchema = z.object({
  messages: z.array(MessageSchema),
  nextCursor: z.string().optional(),
});
export type ConversationHistory = z.infer<typeof ConversationHistorySchema>;

/**
 * List of Conversations Response
 */
export const ConversationListSchema = z.object({
  conversations: z.array(ConversationSchema),
  nextCursor: z.string().optional(),
});
export type ConversationList = z.infer<typeof ConversationListSchema>;
