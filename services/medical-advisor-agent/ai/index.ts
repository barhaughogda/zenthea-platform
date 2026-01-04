import { z } from 'zod';
// @ts-ignore - Placeholder for workspace dependency
import { AIRuntime } from '@starter/ai-runtime';

/**
 * AI layer for governed clinical reasoning.
 * Uses shared AI runtime only.
 */
export const MedicalAdvisorAIOutputSchema = z.object({
  draftAdvisory: z.string(),
  reasoningSteps: z.array(z.string()),
  citations: z.array(z.string()),
  suggestedTools: z.array(z.object({
    name: z.string(),
    args: z.record(z.unknown()),
  })).optional(),
});

export type MedicalAdvisorAIOutput = z.infer<typeof MedicalAdvisorAIOutputSchema>;

/**
 * Placeholder for prompt composition using layered prompts.
 */
export const composeMedicalAdvisorPrompt = (input: any) => {
  return {
    system: "You are a conservative, evidence-aware clinical co-pilot assistant.",
    policy: "All outputs are draft-only. Never diagnose autonomously. Always disclose uncertainty.",
    domain: "Domain: Clinical medicine and evidence-guided reasoning.",
    task: "Task: Assist the clinician with the provided query.",
    memory: "Context from previous relevant patient history.",
    input: `Clinician Input: ${input.query}`,
  };
};

/**
 * AI invocation boundary.
 * Never call models directly; use AIRuntime.
 */
export class MedicalAdvisorAI {
  private runtime: AIRuntime;

  constructor() {
    this.runtime = new AIRuntime();
  }

  async generateAdvisory(input: any): Promise<MedicalAdvisorAIOutput> {
    const promptLayers = composeMedicalAdvisorPrompt(input);
    
    // TODO: Invoke shared AI runtime
    // return this.runtime.invoke(promptLayers, MedicalAdvisorAIOutputSchema);

    return {
      draftAdvisory: "This is a draft advisory. Clinical review required.",
      reasoningSteps: ["Analyzed input", "Searched evidence"],
      citations: ["Guideline-ID-123"],
    };
  }
}

// TODO: Define tool proposals only (no execution).
// TODO: Ensure all outputs are schema-validated.
