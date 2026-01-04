import { 
  IToolExecutionGateway, 
  ToolExecutionCommand, 
  ToolExecutionResult, 
  IToolAuditLogger 
} from './types';
import { validateExecutionCommand } from './validation';
import { v4 as uuidv4 } from 'uuid'; // I'll check if uuid is available or use a simple placeholder

/**
 * Tool Execution Gateway
 * 
 * Coordinates the validation and mediated execution of tool commands.
 */
export class ToolExecutionGateway implements IToolExecutionGateway {
  constructor(
    private readonly auditLogger: IToolAuditLogger
  ) {}

  /**
   * Executes an approved tool command.
   */
  async execute(command: unknown): Promise<ToolExecutionResult> {
    const startTime = new Date().toISOString();
    let validatedCommand: ToolExecutionCommand | undefined;

    try {
      // 1. Validate the command defensively
      validatedCommand = validateExecutionCommand(command);

      // 2. Log receipt of the command
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: 'received',
        actor: validatedCommand.approval.approvedBy,
        timestamp: startTime,
        metadata: validatedCommand.metadata,
      });

      // 3. Dispatch to execution infrastructure (Mocked for now)
      // This is where integration with n8n or other executors would happen.
      const result = await this.dispatchToExecutor(validatedCommand);

      // 4. Log completion
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: result.status === 'success' ? 'completed' : 'failed',
        actor: 'gateway',
        timestamp: new Date().toISOString(),
        metadata: { ...validatedCommand.metadata, executionId: result.executionId },
      });

      return result;

    } catch (error: any) {
      // Log failure if we have enough context
      if (validatedCommand) {
        await this.auditLogger.log({
          eventId: this.generateId(),
          tenantId: validatedCommand.tenantId,
          commandId: validatedCommand.commandId,
          proposalId: validatedCommand.proposalId,
          toolName: validatedCommand.tool.name,
          action: 'failed',
          actor: 'gateway',
          timestamp: new Date().toISOString(),
          metadata: { error: error.message },
        });
      }

      return {
        executionId: this.generateId(),
        commandId: (command as any)?.commandId || 'unknown',
        status: 'failure',
        error: {
          code: error.name === 'ToolExecutionValidationError' ? 'VALIDATION_FAILED' : 'GATEWAY_ERROR',
          message: error.message,
          retryable: false, // Defaulting to false for safety
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Dispatches the command to the underlying executor (e.g., n8n).
   * EXPLICITLY MOCKED for this task.
   */
  private async dispatchToExecutor(command: ToolExecutionCommand): Promise<ToolExecutionResult> {
    // In a real implementation:
    // 1. Look up executor configuration for the tool/tenant
    // 2. Translate command to executor payload
    // 3. Perform HTTP call to executor
    // 4. Map executor response back to ToolExecutionResult

    return {
      executionId: this.generateId(),
      commandId: command.commandId,
      status: 'success',
      data: { message: 'Command accepted for execution (mocked)' },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generates a unique ID.
   */
  private generateId(): string {
    // Simple placeholder for UUID since I don't want to add dependencies unnecessarily
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
