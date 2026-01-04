import { 
  AIRuntime, 
  RuntimeContext, 
  PromptLayer, 
  ModelInvocationOptions, 
  ToolProposalSchema
} from '@starter/ai-runtime';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

/**
 * Chat Agent Specific AI Response Schema
 * Enforces the Tool Proposal Model and structured output.
 */
export const ChatAIOutputSchema = z.object({
  response: z.string().describe('The natural language response for the user'),
  intent_summary: z.string().describe('A brief summary of what the user wants'),
  proposals: z.array(ToolProposalSchema).default([]).describe('Any proposed tool actions'),
});

export type ChatAIOutput = z.infer<typeof ChatAIOutputSchema>;

/**
 * ChatAI is the entry point for AI capabilities in the Chat Agent.
 * It coordinates prompt loading, runtime execution, and output validation.
 */
export class ChatAI {
  private runtime: AIRuntime;

  constructor(runtime: AIRuntime) {
    this.runtime = runtime;
  }

  /**
   * Processes a user message and returns a structured proposal.
   */
  public async processMessage(
    context: RuntimeContext,
    userInput: string,
    options: ModelInvocationOptions
  ): Promise<ChatAIOutput> {
    // 1. Load Prompt Layers from the versioned system of record (docs/09-prompts)
    const layers = await this.loadPromptLayers(userInput);

    // 2. Execute via the shared AI Runtime
    // The runtime handles policy enforcement and tool proposal schema validation
    const result = await this.runtime.execute(context, layers, options);

    // 3. Domain-Specific Output Validation
    return this.validateOutput(result.content, result.toolProposals);
  }

  /**
   * Validates the AI output against the domain schema.
   */
  private validateOutput(content: string, toolProposals?: any[]): ChatAIOutput {
    try {
      const parsed = JSON.parse(content);
      
      // If the model returned tool calls via its native mechanism, 
      // they are already in toolProposals. We merge them if necessary.
      const combinedProposals = [
        ...(toolProposals || []),
        ...(parsed.proposals || [])
      ];

      return ChatAIOutputSchema.parse({
        ...parsed,
        proposals: combinedProposals
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`AI output failed domain validation: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`AI output is not valid JSON: ${content}`);
    }
  }

  /**
   * Loads layered prompts following ADR-004 and the AI Integration Guide.
   */
  private async loadPromptLayers(userInput: string): Promise<PromptLayer[]> {
    // TODO: In production, use a PromptRegistry service for caching and versioning.
    // For the minimal working flow, we read directly from the filesystem.
    
    // Paths relative to service root
    const rootDir = path.resolve(process.cwd());
    const promptDir = path.join(rootDir, '../../docs/09-prompts');
    const templateDir = path.join(promptDir, 'prompt-templates');
    const chatDir = path.join(promptDir, 'chat-agent');

    try {
      const [system, policy, domain, task] = await Promise.all([
        fs.readFile(path.join(templateDir, 'system.md'), 'utf-8'),
        fs.readFile(path.join(templateDir, 'policy.md'), 'utf-8'),
        fs.readFile(path.join(chatDir, 'domain.md'), 'utf-8'),
        fs.readFile(path.join(chatDir, 'task.md'), 'utf-8'),
      ]);

      return [
        { type: 'system', content: system, version: '1.0.0' },
        { type: 'policy', content: policy, version: '1.0.0' },
        { type: 'domain', content: domain, version: '1.0.0' },
        { type: 'task', content: task, version: '1.0.0' },
        { type: 'input', content: userInput },
      ];
    } catch (error) {
      throw new Error(`Failed to load prompt layers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
