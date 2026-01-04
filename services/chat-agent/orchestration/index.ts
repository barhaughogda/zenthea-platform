import { ChatAI, ChatAIOutput } from '../ai';
import { AIRuntime, RuntimeContext, ModelInvocationOptions } from '@starter/ai-runtime';

/**
 * ChatWorkflow coordinates the interaction between the AI layer,
 * domain logic, and external interfaces.
 * 
 * Following the AI Integration Guide:
 * - Orchestration prepares context
 * - AI layer proposes actions
 * - Orchestration validates and applies domain rules
 */
export class ChatWorkflow {
  private chatAI: ChatAI;

  constructor(runtime: AIRuntime) {
    this.chatAI = new ChatAI(runtime);
  }

  /**
   * Orchestrates the processing of a chat message.
   * Returns a validated AI proposal.
   */
  public async handleUserMessage(
    context: RuntimeContext,
    message: string,
    options: ModelInvocationOptions
  ): Promise<ChatAIOutput> {
    // 1. Preparation & Context Assembly
    // (In a fuller implementation, this would load message history, user preferences, etc.)

    // 2. Invoke AI Layer
    // The AI layer is isolated and returns structured proposals only.
    const proposal = await this.chatAI.processMessage(context, message, options);

    // 3. Post-AI Domain Logic & Validation
    // Here we can enforce additional domain invariants that are not easily captured in prompts.
    this.enforceDomainInvariants(proposal);

    // 4. Return Proposal
    // NOTE: We do not persist or execute tool calls here. 
    // Proposals are returned to the caller (API) for final decision/approval.
    return proposal;
  }

  /**
   * Enforces domain-specific rules that the AI might have missed.
   */
  private enforceDomainInvariants(proposal: ChatAIOutput): void {
    // Example: Ensure the AI isn't proposing a high-risk action for a low-privilege intent.
    if (proposal.intent_summary.toLowerCase().includes('hello') && proposal.proposals.length > 0) {
      const hasHighRisk = proposal.proposals.some(p => p.risk_level === 'high');
      if (hasHighRisk) {
        throw new Error('Domain invariant violation: High-risk proposal for greeting intent.');
      }
    }
  }
}
