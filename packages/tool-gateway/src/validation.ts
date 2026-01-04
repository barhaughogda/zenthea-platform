import { ToolExecutionCommand, ToolExecutionCommandSchema } from './types';

export class ToolExecutionValidationError extends Error {
  constructor(public errors: any) {
    super('Tool execution command validation failed');
    this.name = 'ToolExecutionValidationError';
  }
}

/**
 * Validates an incoming tool execution command defensively.
 * Enforces the boundary by ensuring only properly structured and approved commands are processed.
 */
export function validateExecutionCommand(command: unknown): ToolExecutionCommand {
  const result = ToolExecutionCommandSchema.safeParse(command);
  
  if (!result.success) {
    throw new ToolExecutionValidationError(result.error.format());
  }

  // Additional business-level defensive checks could go here
  // For example:
  // - Validating that the tool name is in an allowlist for the tenant
  // - Checking if the idempotency key has been used recently
  
  return result.data;
}
