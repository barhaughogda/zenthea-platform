import { z } from 'zod';

/**
 * Parameter schema for comm.send_message@v1
 */
export const SendMessageV1Schema = z.object({
  recipientId: z.string().uuid(),
  content: z.string().min(1),
  channel: z.enum(['email', 'sms', 'push']).default('email'),
  metadata: z.record(z.string()).optional(),
});

/**
 * Parameter schema for comm.create_notification@v1
 */
export const CreateNotificationV1Schema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  category: z.string().optional(),
});

/**
 * Tool Allowlist Configuration
 */
export const TOOL_ALLOWLIST = {
  'comm.send_message': {
    versions: {
      'v1': SendMessageV1Schema,
    },
  },
  'comm.create_notification': {
    versions: {
      'v1': CreateNotificationV1Schema,
    },
  },
} as const;

export type AllowlistedToolName = keyof typeof TOOL_ALLOWLIST;

/**
 * Validates if a tool and version are allowlisted and if parameters match the schema.
 */
export function validateToolAllowlist(name: string, version: string, params: unknown) {
  const tool = TOOL_ALLOWLIST[name as AllowlistedToolName];
  if (!tool) {
    throw new Error(`UNKNOWN_TOOL: ${name}`);
  }

  const schema = (tool.versions as any)[version];
  if (!schema) {
    throw new Error(`UNKNOWN_VERSION: ${name}@${version}`);
  }

  const result = schema.safeParse(params);
  if (!result.success) {
    throw new Error(`INVALID_PARAMS: ${result.error.message}`);
  }

  return result.data;
}
