import { 
  ToolProposal, 
  ToolProposalSchema, 
  ValidationResult, 
  RuntimeContext, 
  PolicyCheckResult,
  ValidationHooks
} from './types';

/**
 * ValidationManager handles all validation and policy enforcement within the AI runtime.
 */
export class ValidationManager {
  constructor(private readonly hooks?: ValidationHooks) {}

  /**
   * Validates a tool proposal against its schema and any registered hooks.
   * 
   * @param proposal The proposed tool action from the AI.
   * @throws Error if the proposal is fundamentally malformed.
   */
  public async validateToolProposal(proposal: unknown): Promise<ValidationResult> {
    // 1. Schema Validation (Fail Fast)
    const schemaResult = ToolProposalSchema.safeParse(proposal);
    if (!schemaResult.success) {
      return {
        valid: false,
        errors: schemaResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }

    const validatedProposal = schemaResult.data;
    const toolName = validatedProposal.tool.name;

    // 2. Tool Allowlist (Preferred over blocklist)
    if (this.hooks?.allowedToolPatterns && this.hooks.allowedToolPatterns.length > 0) {
      const isAllowed = this.hooks.allowedToolPatterns.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(toolName);
        }
        return toolName === pattern;
      });

      if (!isAllowed) {
        return {
          valid: false,
          errors: [`Tool '${toolName}' is not explicitly allowlisted for this runtime context.`],
        };
      }
    } else {
      // 3. Hard-coded Financial Safeguard (Defense-in-depth / Fallback blocklist)
      // Replaced by allowlist when provided.
      const normalizedName = toolName.toLowerCase();
      if (
        normalizedName.includes('payment') || 
        normalizedName.includes('billing') || 
        normalizedName.includes('monetization') ||
        normalizedName.includes('subscription')
      ) {
        return {
          valid: false,
          errors: ['Financial and billing actions are strictly prohibited in tool proposals.'],
        };
      }
    }

    // 4. External Validation Hook (Domain-specific validation)
    if (this.hooks?.validateToolProposal) {
      const hookResult = await this.hooks.validateToolProposal(validatedProposal);
      if (!hookResult.valid) {
        return hookResult;
      }
    }

    return { valid: true };
  }

  /**
   * Enforces policy constraints before or after AI execution.
   */
  public async enforcePolicy(
    context: RuntimeContext,
    action: string,
    data: any
  ): Promise<PolicyCheckResult> {
    if (this.hooks?.enforcePolicy) {
      return await this.hooks.enforcePolicy(context, action, data);
    }

    // Default policy: allow if no hook is provided (cautionary)
    return { allowed: true };
  }
}
