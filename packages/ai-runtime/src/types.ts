import { z } from 'zod';

/**
 * Core AI Runtime Types
 * Based on ADR-003, ADR-004 and Tool Proposal Model
 */

// --- Tool Proposal Model ---

export const RiskLevelSchema = z.enum(['low', 'medium', 'high']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ToolProposalSchema = z.object({
  proposal_id: z.string().uuid(),
  proposed_by: z.string(),
  timestamp: z.string().datetime(),
  domain: z.enum(['chat', 'sales', 'accounting', 'marketing', 'project-management']),
  tool: z.object({
    name: z.string(),
    version: z.string(),
  }),
  intent: z.object({
    summary: z.string(),
    reasoning: z.string(),
  }),
  parameters: z.record(z.any()),
  risk_level: RiskLevelSchema,
  approval_required: z.boolean().default(true),
  compliance_context: z.object({
    gdpr: z.boolean().default(false),
    hipaa: z.boolean().default(false),
  }),
  idempotency_key: z.string(),
  rollback_supported: z.boolean().default(true),
});

export type ToolProposal = z.infer<typeof ToolProposalSchema>;

// --- Prompt Layering ---

export const PromptLayerTypeSchema = z.enum([
  'system',
  'policy',
  'domain',
  'task',
  'memory',
  'input',
]);
export type PromptLayerType = z.infer<typeof PromptLayerTypeSchema>;

export interface PromptLayer {
  type: PromptLayerType;
  content: string;
  version?: string;
  hash?: string;
}

// --- Model Invocation ---

export interface ModelInvocationOptions {
  modelId: string;
  provider: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface ModelInvocationResult {
  content: string;
  toolProposals?: ToolProposal[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost?: number;
  };
  raw?: any; // Provider-specific raw response (for debugging/advanced use)
}

// --- Policy & Validation ---

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
  modifiedRequest?: any; // Policy might redact or modify the request
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

// --- Context & Hooks ---

export interface RuntimeContext {
  tenantId: string;
  userId: string;
  correlationId: string;
  complianceMode: {
    hipaa: boolean;
    gdpr: boolean;
  };
}

export interface ObservabilityHooks {
  onInvocationStart?: (request: any) => void;
  onInvocationEnd?: (result: ModelInvocationResult) => void;
  onPolicyCheck?: (name: string, result: PolicyCheckResult) => void;
  onToolProposal?: (proposal: ToolProposal) => void;
  onError?: (error: Error) => void;
}

export interface ValidationHooks {
  /**
   * Optional allowlist of tool names or patterns.
   * If provided, only tools matching these patterns will be allowed.
   */
  allowedToolPatterns?: (string | RegExp)[];

  /**
   * Domain-specific validation for tool proposals.
   */
  validateToolProposal?: (proposal: ToolProposal) => Promise<ValidationResult>;

  /**
   * Policy enforcement hook.
   */
  enforcePolicy?: (context: RuntimeContext, action: string, data: any) => Promise<PolicyCheckResult>;
}
