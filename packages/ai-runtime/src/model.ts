import { ModelInvocationOptions, ModelInvocationResult, PromptLayer } from './types';

/**
 * Interface that all model providers must implement.
 * This ensures no provider-specific leakage into the core runtime.
 */
export interface ModelProvider {
  /**
   * Invoke the model with the given prompt and options.
   */
  invoke(prompt: string, options: ModelInvocationOptions): Promise<ModelInvocationResult>;
}

/**
 * ModelInvoker is the core abstraction for calling AI models.
 * It handles provider selection (though in this core version it's passed in)
 * and enforces basic guarantees.
 */
export class ModelInvoker {
  constructor(private readonly provider: ModelProvider) {}

  /**
   * Invokes the model with the composed prompt.
   */
  public async invoke(
    composedPrompt: string,
    options: ModelInvocationOptions
  ): Promise<ModelInvocationResult> {
    try {
      // Basic fail-fast check
      if (!composedPrompt || composedPrompt.trim().length === 0) {
        throw new Error('Composed prompt cannot be empty');
      }

      // Invoke the provider
      const result = await this.provider.invoke(composedPrompt, options);

      // In a real implementation, we might do additional normalization here
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Model invocation failed: ${error.message}`);
      }
      throw new Error('Model invocation failed with an unknown error');
    }
  }
}
