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

      // 2. Enforce Tool-specific rules (Ownership, etc.)
      this.enforceToolRules(validatedCommand);

      // 3. Log receipt of the command
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

      // 4. Dispatch to execution infrastructure (Mocked for now)
      const result = await this.dispatchToExecutor(validatedCommand);

      // 5. Log completion
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
          code: this.mapErrorToCode(error),
          message: error.message,
          retryable: false, 
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Enforces tool-specific rules before execution.
   */
  private enforceToolRules(command: ToolExecutionCommand) {
    const consentTools = ['createConsent', 'revokeConsent', 'updateConsentPreferences'];
    
    if (consentTools.includes(command.tool.name)) {
      const patientId = command.parameters.patientId;
      const actorId = command.approval.approvedBy;

      // Ownership Check: Patient can only act on their own records
      if (patientId !== actorId) {
        throw new Error('FORBIDDEN: Patient can only act on own records');
      }

      // Idempotency: In a real system, we'd check if idempotencyKey was already used
      if (!command.idempotencyKey) {
        throw new Error('VALIDATION_FAILED: Idempotency key required');
      }
    }
  }

  private mapErrorToCode(error: any): string {
    if (error.name === 'ToolExecutionValidationError') return 'VALIDATION_FAILED';
    if (error.message.startsWith('FORBIDDEN')) return 'FORBIDDEN';
    if (error.message.startsWith('UNAUTHORIZED')) return 'UNAUTHORIZED';
    return 'GATEWAY_ERROR';
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
