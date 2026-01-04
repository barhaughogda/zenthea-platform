import { 
  ValidationHooks, 
  ObservabilityHooks, 
  ToolProposal, 
  ValidationResult, 
  PolicyCheckResult, 
  RuntimeContext,
  ModelInvocationResult
} from '@starter/ai-runtime';

export interface EvalThresholds {
  maxCost?: number;
  maxLatencyMs?: number;
  maxTokens?: number;
}

export interface EvalResult {
  passed: boolean;
  score?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

/**
 * AI Evaluation Hooks for CI/CD and monitoring.
 */
export class EvaluationHooks implements ValidationHooks, ObservabilityHooks {
  private startTime: number = 0;
  private lastLatency: number = 0;

  constructor(
    private readonly thresholds: EvalThresholds = {},
    private readonly complianceRules: string[] = []
  ) {}

  // --- Observability Hooks (Soft Gates / Tracking) ---

  onInvocationStart(): void {
    this.startTime = Date.now();
  }

  onInvocationEnd(result: ModelInvocationResult): void {
    this.lastLatency = Date.now() - this.startTime;
    
    // Tracking for cost and latency
    console.log(`[AI-EVAL] Latency: ${this.lastLatency}ms`);
    console.log(`[AI-EVAL] Tokens: ${result.usage.totalTokens}`);
    if (result.usage.cost) {
      console.log(`[AI-EVAL] Cost: $${result.usage.cost}`);
    }
  }

  // --- Validation Hooks (Hard Gates) ---

  async validateToolProposal(proposal: ToolProposal): Promise<ValidationResult> {
    // 1. Compliance Check (GDPR/HIPAA)
    if (proposal.compliance_context.hipaa || proposal.compliance_context.gdpr) {
      // Basic check: if it claims compliance but we're in a test mode, verify structure
      if (!proposal.intent.reasoning) {
        return { 
          valid: false, 
          errors: ['Compliance-sensitive tools must have detailed reasoning.'] 
        };
      }
    }

    // 2. Prohibited Tool behavior (already handled by runtime, but we can add more)
    const toolName = proposal.tool.name.toLowerCase();
    if (toolName.includes('delete') || toolName.includes('purge')) {
      return {
        valid: false,
        errors: [`Dangerous tool action '${toolName}' is prohibited in standard evaluations.`]
      };
    }

    return { valid: true };
  }

  async enforcePolicy(
    context: RuntimeContext, 
    action: string, 
    data: any
  ): Promise<PolicyCheckResult> {
    if (action === 'invocation_end') {
      const result = data as ModelInvocationResult;

      // 1. Safety Check: Refusal rules
      const content = result.content.toLowerCase();
      const refusalKeywords = ['i cannot', 'i am sorry', 'unauthorized', 'prohibited'];
      
      // If we expect a refusal but got one, it might be correct.
      // If we DID NOT expect a refusal but got one, it's a quality issue (Soft Gate).
      // However, if it outputs disallowed content, that's a Hard Gate.
      
      const disallowedContent = ['password', 'secret_key', 'api_key']; // Example
      for (const keyword of disallowedContent) {
        if (content.includes(keyword)) {
          return { 
            allowed: false, 
            reason: `Safety violation: Disallowed content '${keyword}' found in output.` 
          };
        }
      }

      // 2. Cost Soft Gate
      if (this.thresholds.maxCost && result.usage.cost && result.usage.cost > this.thresholds.maxCost) {
        console.warn(`[AI-EVAL] Cost warning: $${result.usage.cost} exceeds threshold $${this.thresholds.maxCost}`);
      }

      // 3. Latency Soft Gate
      if (this.thresholds.maxLatencyMs && this.lastLatency > this.thresholds.maxLatencyMs) {
        console.warn(`[AI-EVAL] Latency warning: ${this.lastLatency}ms exceeds threshold ${this.thresholds.maxLatencyMs}ms`);
      }
    }

    return { allowed: true };
  }
}
