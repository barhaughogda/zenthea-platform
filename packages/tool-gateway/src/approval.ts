import { 
  GovernanceControlResult, 
  ApprovalSignal, 
  IApprovalSignalEmitter,
  GovernanceReasonCode
} from './types';

/**
 * Deterministic engine for emitting approval signals derived from governance events.
 * SIGNALS ONLY. No enforcement or persistence.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, or agentId.
 */
export class ApprovalSignalEngine {
  constructor(private readonly emitter: IApprovalSignalEmitter) {}

  /**
   * Processes a governance event and emits an approval signal if applicable.
   * Deterministic and non-blocking.
   */
  processGovernanceEvent(event: GovernanceControlResult): void {
    // Noise reduction: Filter warnings
    if (event.decision === 'WARNING') {
      if (event.reasonCode !== 'DEPRECATED_AGENT' || !this.isWriteTool(event.toolName)) {
        return;
      }
    }

    const severity = this.mapToSeverity(event.reasonCode, event.decision);
    const escalationLevel = this.mapToEscalation(event.reasonCode, event.decision);

    const signal: ApprovalSignal = {
      triggerType: event.reasonCode,
      severity,
      escalationLevel,
      agentVersion: event.agentVersion,
      policySnapshotHash: event.policySnapshotHash,
      timestamp: event.timestamp,
    };

    // Non-blocking emission
    try {
      this.emitter.emitSignal(signal);
    } catch (err) {
      // ⚠️ CRITICAL: Signal emission failure must NOT block the gateway.
      console.error('[Approval] Failed to emit approval signal:', err);
    }
  }

  /**
   * Conservative allowlist/prefix check for write tools.
   */
  private isWriteTool(toolName: string): boolean {
    const writePrefixes = [
      'consent.create',
      'consent.revoke',
      'consent.update',
      'chat.sendMessage',
      'chat.createConversation',
      'appointment.requestAppointment',
      'appointment.cancelAppointment'
    ];

    // Check if tool name starts with any of the write patterns or follows the .write suffix convention
    return writePrefixes.some(prefix => toolName.startsWith(prefix)) || 
           toolName.endsWith('.write') ||
           // Also check common specific tool names if not covered by prefix
           ['createConsent', 'revokeConsent', 'updateConsentPreferences'].includes(toolName);
  }

  /**
   * Maps governance reason codes to signal severity.
   */
  private mapToSeverity(code: GovernanceReasonCode, decision: 'DENIED' | 'WARNING'): ApprovalSignal['severity'] {
    if (decision === 'WARNING') return 'low';

    switch (code) {
      case 'UNKNOWN_AGENT':
      case 'LIFECYCLE_DENIED':
        return 'high';
      case 'DEPRECATED_AGENT':
        return 'low';
      case 'RATE_LIMITED':
      case 'SCOPE_DENIED':
      case 'UNKNOWN_TOOL':
      case 'UNKNOWN_AGENT_VERSION':
      case 'FEATURE_DISABLED':
      case 'VALIDATION_FAILED':
        return 'medium';
      default:
        return 'medium';
    }
  }

  /**
   * Maps governance reason codes to escalation levels (1-3).
   */
  private mapToEscalation(code: GovernanceReasonCode, decision: 'DENIED' | 'WARNING'): ApprovalSignal['escalationLevel'] {
    if (decision === 'WARNING') return 1;

    switch (code) {
      case 'UNKNOWN_AGENT':
      case 'LIFECYCLE_DENIED':
        return 3;
      case 'UNKNOWN_AGENT_VERSION':
      case 'UNKNOWN_TOOL':
      case 'SCOPE_DENIED':
      case 'FEATURE_DISABLED':
      case 'VALIDATION_FAILED':
      case 'RATE_LIMITED': // Fix: RATE_LIMITED maps to Level 2
        return 2;
      case 'DEPRECATED_AGENT':
        return 1;
      default:
        return 2;
    }
  }
}
