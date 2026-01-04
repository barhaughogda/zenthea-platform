import { 
  RuntimeContext, 
  ModelInvocationOptions, 
  ModelInvocationResult, 
  PromptLayer, 
  ObservabilityHooks,
  ValidationHooks,
  ToolProposal
} from './types';
import { PromptComposer } from './prompt';
import { ModelInvoker, ModelProvider } from './model';
import { ValidationManager } from './validation';

export interface AIRuntimeConfig {
  provider: ModelProvider;
  observability?: ObservabilityHooks;
  validation?: ValidationHooks;
}

/**
 * AIRuntime is the core execution environment for AI capabilities.
 * It enforces the canonical execution pipeline defined in docs/03-ai-platform/ai-runtime.md
 */
export class AIRuntime {
  private readonly modelInvoker: ModelInvoker;
  private readonly validationManager: ValidationManager;
  private readonly observability?: ObservabilityHooks;

  constructor(config: AIRuntimeConfig) {
    this.modelInvoker = new ModelInvoker(config.provider);
    this.validationManager = new ValidationManager(config.validation);
    this.observability = config.observability;
  }

  /**
   * The main entry point for AI execution.
   */
  public async execute(
    context: RuntimeContext,
    layers: PromptLayer[],
    options: ModelInvocationOptions
  ): Promise<ModelInvocationResult> {
    const correlationId = context.correlationId;

    try {
      this.observability?.onInvocationStart?.({ context, layers, options });

      // 1. Policy Pre-Check
      const preCheck = await this.validationManager.enforcePolicy(context, 'invocation_start', { layers, options });
      if (!preCheck.allowed) {
        throw new Error(`Policy pre-check failed: ${preCheck.reason || 'Unauthorized'}`);
      }

      // 2. Prompt Composition
      const composedPrompt = PromptComposer.compose(layers);

      // 3. Model Invocation
      const result = await this.modelInvoker.invoke(composedPrompt, options);

      // 4. Tool Proposal Validation
      if (result.toolProposals && result.toolProposals.length > 0) {
        for (const proposal of result.toolProposals) {
          const validation = await this.validationManager.validateToolProposal(proposal);
          if (!validation.valid) {
            throw new Error(`Tool proposal validation failed: ${validation.errors?.join(', ')}`);
          }
          this.observability?.onToolProposal?.(proposal);
        }
      }

      // 5. Policy Post-Check
      const postCheck = await this.validationManager.enforcePolicy(context, 'invocation_end', result);
      if (!postCheck.allowed) {
        throw new Error(`Policy post-check failed: ${postCheck.reason || 'Unauthorized'}`);
      }

      this.observability?.onInvocationEnd?.(result);
      return result;
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error(String(error));
      this.observability?.onError?.(finalError);
      throw finalError;
    }
  }
}
