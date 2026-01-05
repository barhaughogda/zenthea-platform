import { 
  IToolExecutionGateway, 
  ToolExecutionCommand, 
  ToolExecutionResult, 
  IToolAuditLogger 
} from './types';
import { validateExecutionCommand } from './validation';

/**
 * Tool Execution Gateway
 * 
 * Coordinates the validation and mediated execution of tool commands.
 */
export class ToolExecutionGateway implements IToolExecutionGateway {
  // Simple in-memory rate limiting for demonstration/mock purposes
  private rateLimits = new Map<string, { attempts: number; windowStart: number }>();

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

      // 2. Rate Limiting
      this.checkRateLimit(validatedCommand);

      // 3. Enforce Tool-specific rules (Ownership, etc.)
      this.enforceToolRules(validatedCommand);

      // 4. Log receipt of the command
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: 'received',
        actor: validatedCommand.approval.approvedBy,
        timestamp: startTime,
        idempotencyKey: validatedCommand.idempotencyKey,
        payload: validatedCommand.parameters, // Audit store MAY contain PHI
        metadata: validatedCommand.metadata,
      });

      // 5. Dispatch to execution infrastructure (Mocked for now)
      const result = await this.dispatchToExecutor(validatedCommand);

      // 6. Log completion
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: result.status === 'success' ? 'completed' : 'failed',
        actor: 'gateway',
        timestamp: new Date().toISOString(),
        idempotencyKey: validatedCommand.idempotencyKey,
        outcome: result.status === 'success' ? 'SUCCESS' : result.error?.code,
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
    const chatTools = ['chat.createConversation', 'chat.sendMessage'];
    
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

    if (chatTools.includes(command.tool.name)) {
      const patientId = command.parameters.patientId;
      const actorId = command.approval.approvedBy;

      // Ownership Check
      if (patientId !== actorId) {
        throw new Error('FORBIDDEN: Patient can only send their own messages');
      }

      // Idempotency Check
      if (!command.idempotencyKey) {
        throw new Error('VALIDATION_FAILED: Idempotency key required');
      }
    }
  }

  /**
   * Simple rate limiting check.
   */
  private checkRateLimit(command: ToolExecutionCommand) {
    const now = Date.now();
    const userId = command.approval.approvedBy;
    const toolName = command.tool.name;
    
    // Per-user, per-tool rate limit
    const userKey = `rate_limit:user:${userId}:${toolName}`;
    this.applyLimit(userKey, 10, 60000, now); // 10 per minute

    // Per-conversation limit for sendMessage
    if (toolName === 'chat.sendMessage') {
      const convId = command.parameters.conversationId;
      if (convId) {
        const convKey = `rate_limit:conv:${convId}`;
        this.applyLimit(convKey, 30, 60000, now); // 30 per minute per conversation
      }
    }
  }

  private applyLimit(key: string, maxAttempts: number, windowMs: number, now: number) {
    const existing = this.rateLimits.get(key);

    if (!existing || (now - existing.windowStart > windowMs)) {
      this.rateLimits.set(key, { attempts: 1, windowStart: now });
      return;
    }

    if (existing.attempts >= maxAttempts) {
      throw new Error('RATE_LIMITED: Too many requests');
    }

    existing.attempts += 1;
  }

  private mapErrorToCode(error: any): string {
    if (error.name === 'ToolExecutionValidationError') return 'VALIDATION_FAILED';
    if (error.message.startsWith('FORBIDDEN')) return 'FORBIDDEN';
    if (error.message.startsWith('UNAUTHORIZED')) return 'UNAUTHORIZED';
    if (error.message.startsWith('RATE_LIMITED')) return 'RATE_LIMITED';
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
