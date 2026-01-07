/* eslint-disable @typescript-eslint/no-explicit-any */
import * as crypto from 'crypto';
import { 
  IToolExecutionGateway, 
  ToolExecutionCommand, 
  ToolExecutionResult, 
  IToolAuditLogger,
  IToolTelemetryLogger,
  ToolGatewayEvent,
  IGovernanceLogger,
  GovernanceControlResult,
  GovernanceReasonCode,
  AgentType,
  IPolicySnapshotEmitter,
  IApprovalSignalEmitter
} from './types';
import { validateExecutionCommand } from './validation';
import { ToolTelemetryLogger } from './audit';
import { toolGatewayMetrics } from './metrics';
import { AbuseSignalEngine } from './abuse';
import { PolicyEvaluator, generatePolicySnapshot } from './governance';
import { ApprovalSignalEngine } from './approval';
import { IdempotencyStore } from './idempotency-store';
import { MockMutationExecutor } from './mock-executor';
import { validateToolAllowlist, TOOL_ALLOWLIST } from './tool-allowlist';

/**
 * Tool Execution Gateway
 */
export class ToolExecutionGateway implements IToolExecutionGateway {
  // Simple in-memory rate limiting for demonstration/mock purposes
  private rateLimits = new Map<string, { attempts: number; windowStart: number }>();
  
  // Deterministic Abuse Signal Engine (Slice 04.3)
  private readonly abuseEngine: AbuseSignalEngine;
  
  // Approval Signal Engine (Slice 08.1)
  private readonly approvalEngine: ApprovalSignalEngine;

  // Policy Evaluator (Slice 06.1)
  private readonly policyEvaluator = new PolicyEvaluator();

  // Active Policy Snapshot Hash (Slice 07.3)
  private readonly policySnapshotHash: string;

  // Mutation Utilities (Slice 17)
  private readonly idempotencyStore = new IdempotencyStore();
  private readonly mutationExecutor = new MockMutationExecutor();

  constructor(
    private readonly auditLogger: IToolAuditLogger,
    private readonly telemetryLogger: IToolTelemetryLogger = new ToolTelemetryLogger(),
    private readonly governanceLogger?: IGovernanceLogger,
    private readonly snapshotEmitter?: IPolicySnapshotEmitter,
    private readonly approvalEmitter?: IApprovalSignalEmitter
  ) {
    // Generate active policy snapshot hash (Slice 07.3)
    this.policySnapshotHash = generatePolicySnapshot().policyHash;

    // Initialize Abuse Signal Engine with a metadata-only emitter
    this.abuseEngine = new AbuseSignalEngine((signal) => {
      // Signals are SIGNALS ONLY. No enforcement occurs here.
      // ⚠️ SECURITY: No PHI, actorId, or tenantId in the signal.
      console.log(`[AbuseSignal] [${signal.severity.toUpperCase()}] ${signal.ruleId} - Tool: ${signal.toolName || 'N/A'}, Actor: ${signal.actorType}, Observed: ${signal.observedCount}/${signal.threshold} (Window: ${signal.windowMs}ms)`);
    });

    // Initialize Approval Signal Engine (Slice 08.1)
    this.approvalEngine = new ApprovalSignalEngine(
      this.approvalEmitter || {
        emitSignal: (signal) => {
          // Metadata-only log as fallback
          console.log(`[ApprovalSignal] [${signal.severity.toUpperCase()}] Level ${signal.escalationLevel} - Trigger: ${signal.triggerType}, Version: ${signal.agentVersion}, Hash: ${signal.policySnapshotHash}`);
        }
      }
    );

    // Emit initial policy snapshot (Slice 06.4)
    this.emitPolicySnapshot();
  }

  /**
   * Generates and emits a governance policy snapshot.
   * Non-blocking and error-isolated.
   */
  private emitPolicySnapshot() {
    try {
      const snapshot = generatePolicySnapshot();
      
      if (this.snapshotEmitter) {
        // Fire and forget
        this.snapshotEmitter.emit(snapshot).catch(err => {
          console.error('[Governance] Failed to emit policy snapshot:', err);
        });
      } else {
        // Metadata-only log as fallback
        console.log(`[Governance] [PolicySnapshot] Version: ${snapshot.policyVersion}, Hash: ${snapshot.policyHash}, Agents: ${snapshot.agentCount}, Tools: ${snapshot.toolCount}`);
      }
    } catch (err) {
      // ⚠️ CRITICAL: Failure must NOT block gateway startup.
      console.error('[Governance] Fatal error during policy snapshot generation:', err);
    }
  }

  /**
   * Executes an approved tool command.
   */
  async execute(command: unknown): Promise<ToolExecutionResult> {
    const startTime = Date.now();
    const startTimestamp = new Date().toISOString();
    let validatedCommand: ToolExecutionCommand | undefined;
    let decision: ToolGatewayEvent['decision'] = 'allowed';
    let errorCode: string | undefined;

    try {
      // 1. Validate the command defensively
      try {
        validatedCommand = validateExecutionCommand(command);

        // CP-17: Mutation Guard (Allowlist + Approval)
        const isMutation = (validatedCommand.tool.name in TOOL_ALLOWLIST);
        if (isMutation) {
          // 1.1 Enforce Approval
          if (!validatedCommand.approval || validatedCommand.approval.approvalType === undefined) {
            throw new Error('APPROVAL_REQUIRED: Mutation requires explicit approval record');
          }

          // 1.2 Validate via Allowlist Schema
          validateToolAllowlist(
            validatedCommand.tool.name,
            validatedCommand.tool.version,
            validatedCommand.parameters
          );

          // 1.3 Check Idempotency
          const priorResult = await this.idempotencyStore.get(
            validatedCommand.tenantId,
            validatedCommand.idempotencyKey,
            validatedCommand.tool.name,
            validatedCommand.tool.version,
            validatedCommand.parameters
          );

          if (priorResult) {
            // Replay prior result
            return priorResult;
          }
        }
      } catch (err: any) {
        decision = 'error';
        errorCode = this.mapErrorToCode(err);

        const toolName = (command as any)?.tool?.name || 'unknown';
        const agentId = (command as any)?.agentId || 'unknown';
        const agentVersion = (command as any)?.agentVersion || 'unknown';
        const agentType = this.policyEvaluator.evaluate(agentId, agentVersion, toolName).agentType;
        
        this.emitGovernanceControl(agentType, agentVersion, toolName, errorCode as GovernanceReasonCode);

        throw err;
      }

      // 1.5. Evaluate Agent Governance Policy (Slice 06.1)
      const evaluation = this.policyEvaluator.evaluate(validatedCommand.agentId, validatedCommand.agentVersion, validatedCommand.tool.name);
      if (!evaluation.allowed) {
        decision = 'denied';
        errorCode = evaluation.reasonCode;

        this.emitGovernanceControl(
          evaluation.agentType, 
          validatedCommand.agentVersion,
          validatedCommand.tool.name, 
          evaluation.reasonCode as GovernanceReasonCode
        );

        throw new Error(`FORBIDDEN: ${evaluation.reasonCode}`);
      }

      // Lifecycle Warning (Slice 07.2)
      if (evaluation.warningCode) {
        this.emitGovernanceControl(
          evaluation.agentType,
          validatedCommand.agentVersion,
          validatedCommand.tool.name,
          evaluation.warningCode,
          'WARNING'
        );
      }

      // 2. Rate Limiting
      try {
        this.checkRateLimit(validatedCommand);
      } catch (err: any) {
        decision = 'rate_limited';
        errorCode = 'RATE_LIMITED';

        const agentType = this.policyEvaluator.evaluate(validatedCommand.agentId, validatedCommand.agentVersion, validatedCommand.tool.name).agentType;
        this.emitGovernanceControl(agentType, validatedCommand.agentVersion, validatedCommand.tool.name, 'RATE_LIMITED');

        throw err;
      }

      // 3. Enforce Tool-specific rules (Ownership, etc.)
      try {
        this.enforceToolRules(validatedCommand);
      } catch (err: any) {
        decision = 'denied';
        errorCode = this.mapErrorToCode(err);

        // Emit governance control if it matches a governance reason code
        if (errorCode === 'VALIDATION_FAILED' || errorCode === 'FEATURE_DISABLED') {
          const agentType = this.policyEvaluator.evaluate(validatedCommand.agentId, validatedCommand.agentVersion, validatedCommand.tool.name).agentType;
          this.emitGovernanceControl(agentType, validatedCommand.agentVersion, validatedCommand.tool.name, errorCode as GovernanceReasonCode);
        } else if (errorCode === 'FORBIDDEN') {
          const agentType = this.policyEvaluator.evaluate(validatedCommand.agentId, validatedCommand.agentVersion, validatedCommand.tool.name).agentType;
          this.emitGovernanceControl(agentType, validatedCommand.agentVersion, validatedCommand.tool.name, 'SCOPE_DENIED');
        }

        throw err;
      }

      // 4. Log receipt of the command
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: (validatedCommand.tool.name in TOOL_ALLOWLIST) ? 'command_received' : 'received',
        actor: validatedCommand.approval.approvedBy,
        timestamp: startTimestamp,
        idempotencyKey: validatedCommand.idempotencyKey,
        payload: (validatedCommand.tool.name in TOOL_ALLOWLIST) ? undefined : validatedCommand.parameters, // Audit store MAY contain PHI for non-mutations
        metadata: validatedCommand.metadata,
      });

      // 5. Dispatch to execution infrastructure
      let result: ToolExecutionResult;
      
      if (validatedCommand.tool.name in TOOL_ALLOWLIST) {
        // CP-17: Mutation Dispatch
        await this.auditLogger.log({
          eventId: this.generateId(),
          tenantId: validatedCommand.tenantId,
          commandId: validatedCommand.commandId,
          proposalId: validatedCommand.proposalId,
          toolName: validatedCommand.tool.name,
          action: 'command_dispatched',
          actor: 'gateway',
          timestamp: new Date().toISOString(),
          metadata: validatedCommand.metadata,
        });

        result = await this.mutationExecutor.execute(validatedCommand);

        // CP-17: Save Idempotency
        if (result.status === 'success') {
          await this.idempotencyStore.save(
            validatedCommand.tenantId,
            validatedCommand.idempotencyKey,
            validatedCommand.tool.name,
            validatedCommand.tool.version,
            validatedCommand.parameters,
            result
          );
        }
      } else {
        result = await this.dispatchToExecutor(validatedCommand);
      }

      if (result.status === 'failure') {
        decision = 'error';
        errorCode = result.error?.code;
      }

      // 6. Log completion
      const isMutation = (validatedCommand.tool.name in TOOL_ALLOWLIST);
      await this.auditLogger.log({
        eventId: this.generateId(),
        tenantId: validatedCommand.tenantId,
        commandId: validatedCommand.commandId,
        proposalId: validatedCommand.proposalId,
        toolName: validatedCommand.tool.name,
        action: isMutation 
          ? (result.status === 'success' ? 'command_succeeded' : 'command_failed')
          : (result.status === 'success' ? 'completed' : 'failed'),
        actor: 'gateway',
        timestamp: new Date().toISOString(),
        idempotencyKey: validatedCommand.idempotencyKey,
        outcome: result.status === 'success' ? 'SUCCESS' : result.error?.code,
        metadata: { ...validatedCommand.metadata, executionId: result.executionId },
      });

      return result;

    } catch (error: any) {
      if (decision === 'allowed') {
        decision = 'error';
        errorCode = this.mapErrorToCode(error);
      }

      // Log failure if we have enough context
      if (validatedCommand) {
        const isMutation = (validatedCommand.tool.name in TOOL_ALLOWLIST);
        await this.auditLogger.log({
          eventId: this.generateId(),
          tenantId: validatedCommand.tenantId,
          commandId: validatedCommand.commandId,
          proposalId: validatedCommand.proposalId,
          toolName: validatedCommand.tool.name,
          action: isMutation ? 'command_rejected' : 'failed',
          actor: 'gateway',
          timestamp: new Date().toISOString(),
          metadata: { 
            error: error.message,
            reasonCode: decision === 'denied' ? 'FORBIDDEN' : (errorCode || this.mapErrorToCode(error))
          },
        });
      }

      return {
        executionId: this.generateId(),
        commandId: (command as any)?.commandId || 'unknown',
        status: 'failure',
        error: {
          code: errorCode || (decision === 'denied' ? 'FORBIDDEN' : this.mapErrorToCode(error)),
          message: error.message,
          retryable: false, 
        },
        timestamp: new Date().toISOString(),
      };
    } finally {
      // 7. Emit structured telemetry (Metadata only - NO PHI)
      const latencyMs = Date.now() - startTime;
      
      const telemetryEvent: ToolGatewayEvent = {
        toolName: validatedCommand?.tool.name || (command as any)?.tool?.name || 'unknown',
        tenantId: validatedCommand?.tenantId || (command as any)?.tenantId || 'unknown',
        actorId: validatedCommand?.approval.approvedBy || (command as any)?.approval?.approvedBy || 'unknown',
        actorType: this.resolveActorType(validatedCommand),
        agentVersion: validatedCommand?.agentVersion || (command as any)?.agentVersion || 'unknown',
        policySnapshotHash: this.policySnapshotHash,
        requestId: validatedCommand?.metadata.correlationId || (command as any)?.metadata?.correlationId || 'unknown',
        idempotencyKeyHash: this.hashIdempotencyKey(validatedCommand?.idempotencyKey || (command as any)?.idempotencyKey),
        decision,
        errorCode,
        latencyMs,
        timestamp: startTimestamp,
      };

      // We await to ensure "exactly once" and catch any issues during development,
      // though in production this might be fire-and-forget.
      await this.telemetryLogger.emit(telemetryEvent).catch(err => {
        console.error('Failed to emit telemetry:', err);
      });

      // 8. Emit metrics (Derived from telemetry - NO PHI, Low cardinality)
      const metricToolName = telemetryEvent.toolName;
      const metricActorType = telemetryEvent.actorType;

      toolGatewayMetrics.recordRequest({
        toolName: metricToolName,
        decision: telemetryEvent.decision,
        actorType: metricActorType,
      });

      toolGatewayMetrics.recordLatency({
        toolName: metricToolName,
        decision: telemetryEvent.decision,
        latencyMs,
      });

      if (errorCode) {
        toolGatewayMetrics.recordError({
          toolName: metricToolName,
          errorCode,
        });

        if (telemetryEvent.decision === 'rate_limited') {
          toolGatewayMetrics.recordRateLimited({
            toolName: metricToolName,
            actorType: metricActorType,
          });
        }
      }

      // 9. Process Abuse Signals (Deterministic, Non-blocking, Metadata-only)
      this.abuseEngine.processEvent(telemetryEvent);
    }
  }

  /**
   * Enforces tool-specific rules before execution.
   */
  private enforceToolRules(command: ToolExecutionCommand) {
    const consentTools = ['createConsent', 'revokeConsent', 'updateConsentPreferences'];
    const chatTools = ['chat.createConversation', 'chat.sendMessage'];
    const appointmentTools = ['appointment.requestAppointment', 'appointment.cancelAppointment'];
    
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

    if (appointmentTools.includes(command.tool.name)) {
      const patientId = command.parameters.patientId;
      const actorId = command.approval.approvedBy;

      // Ownership Check
      if (patientId !== actorId) {
        throw new Error('FORBIDDEN: Patient can only manage their own appointment requests');
      }

      // Consent Check: In a real system, we would verify the patient has granted 'appointment' scope
      // For this migration step, we assume presence of the command implies intent, 
      // but a production gateway would call the Consent Agent here.
      // if (!hasConsent(patientId, 'appointment:write')) throw new Error('CONSENT_REQUIRED');

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
    
    if (toolName === 'appointment.requestAppointment') {
      this.applyLimit(userKey, 3, 600000, now); // 3 per 10 minutes
    } else if (toolName === 'appointment.cancelAppointment') {
      this.applyLimit(userKey, 10, 600000, now); // 10 per 10 minutes
    } else {
      this.applyLimit(userKey, 10, 60000, now); // Default: 10 per minute
    }

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
    if (error.message.startsWith('UNKNOWN_TOOL')) return 'UNKNOWN_TOOL';
    if (error.message.startsWith('UNKNOWN_VERSION')) return 'UNKNOWN_VERSION';
    if (error.message.startsWith('INVALID_PARAMS')) return 'INVALID_PARAMS';
    if (error.message.startsWith('APPROVAL_REQUIRED')) return 'APPROVAL_REQUIRED';
    if (error.message.startsWith('IDEMPOTENCY_COLLISION')) return 'IDEMPOTENCY_COLLISION';
    if (error.name === 'ToolExecutionValidationError') return 'VALIDATION_FAILED';
    if (error.message.startsWith('FORBIDDEN')) return 'FORBIDDEN';
    if (error.message.startsWith('UNAUTHORIZED')) return 'UNAUTHORIZED';
    if (error.message.startsWith('RATE_LIMITED')) return 'RATE_LIMITED';
    if (error.message.startsWith('CONSENT_REQUIRED')) return 'CONSENT_REQUIRED';
    if (error.message.startsWith('CONFLICT')) return 'CONFLICT';
    if (error.message.startsWith('FEATURE_DISABLED')) return 'FEATURE_DISABLED';
    if (error.message.startsWith('UPSTREAM_UNAVAILABLE')) return 'UPSTREAM_UNAVAILABLE';
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

  private hashIdempotencyKey(key?: string): string {
    if (!key) return 'none';
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  private resolveActorType(command?: ToolExecutionCommand): ToolGatewayEvent['actorType'] {
    if (!command) return 'unknown';
    
    // If automated, it's a system actor
    if (command.approval.approvalType === 'automated') return 'system';
    
    // In the current context of Slice 04, most human approvals are patients 
    // using the patient portal, but we mark as unknown if we can't be sure.
    // A more robust implementation would include actorType in the approval object.
    const toolName = command.tool.name;
    const isPatientTool = toolName.startsWith('chat.') || 
                          toolName.includes('Consent') || 
                          toolName.includes('Appointment');
                          
    return isPatientTool ? 'patient' : 'unknown';
  }

  /**
   * Emits a governance control result and records the corresponding metric.
   * 🚫 STRICTLY NO PHI, actorId, tenantId, or requestId.
   */
  private emitGovernanceControl(
    agentType: AgentType,
    agentVersion: string,
    toolName: string,
    reasonCode: GovernanceReasonCode,
    decision: 'DENIED' | 'WARNING' = 'DENIED'
  ) {
    const result: GovernanceControlResult = {
      decision,
      agentType,
      agentVersion,
      policySnapshotHash: this.policySnapshotHash,
      toolName,
      reasonCode,
      timestamp: new Date().toISOString(),
    };

    if (this.governanceLogger) {
      // Fire and forget
      this.governanceLogger.emit(result).catch(err => {
        console.error('Failed to emit governance control result:', err);
      });
    }

    // Process Approval Signals (Slice 08.1) - Non-blocking
    this.approvalEngine.processGovernanceEvent(result);

    // Emit governance metrics (Slice 06.2)
    if (decision === 'DENIED') {
      toolGatewayMetrics.recordGovernanceDeny({
        toolName,
        agentType,
        reasonCode,
      });
    } else {
      toolGatewayMetrics.recordGovernanceWarning({
        toolName,
        agentType,
        reasonCode,
      });
    }
  }
}
