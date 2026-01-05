import { 
  ToolExecutionCommand, 
  ToolExecutionCommandSchema,
  CreateConsentParamsSchema,
  RevokeConsentParamsSchema,
  UpdateConsentPreferencesParamsSchema,
  CreateConversationParamsSchema,
  SendMessageParamsSchema,
  RequestAppointmentParamsSchema,
  CancelAppointmentParamsSchema
} from './types';

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

  const validatedCommand = result.data;

  // Validate tool-specific parameters
  switch (validatedCommand.tool.name) {
    case 'createConsent':
      validateParams(CreateConsentParamsSchema, validatedCommand.parameters);
      break;
    case 'revokeConsent':
      validateParams(RevokeConsentParamsSchema, validatedCommand.parameters);
      break;
    case 'updateConsentPreferences':
      validateParams(UpdateConsentPreferencesParamsSchema, validatedCommand.parameters);
      break;
    case 'chat.createConversation':
      validateParams(CreateConversationParamsSchema, validatedCommand.parameters);
      break;
    case 'chat.sendMessage':
      validateParams(SendMessageParamsSchema, validatedCommand.parameters);
      break;
    case 'appointment.requestAppointment':
      validateParams(RequestAppointmentParamsSchema, validatedCommand.parameters);
      break;
    case 'appointment.cancelAppointment':
      validateParams(CancelAppointmentParamsSchema, validatedCommand.parameters);
      break;
    default:
      // Unknown tool, but we might allow generic tools if not restricted
      break;
  }
  
  return validatedCommand;
}

function validateParams(schema: any, params: unknown) {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new ToolExecutionValidationError(result.error.format());
  }
}
