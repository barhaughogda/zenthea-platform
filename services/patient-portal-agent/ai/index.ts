import { z } from 'zod';
// TODO: Import shared AI runtime when available
// import { AiRuntime } from '@starter/ai-runtime';

/**
 * AI Layer for Patient Portal Agent.
 * Governed AI interaction with structured output.
 */

/**
 * Structured output schema for the AI agent.
 * Enforces non-alarmist, educational language.
 */
export const PatientPortalAiOutputSchema = z.object({
  educationalSummary: z.string().describe('Clear, plain-language explanation of the health data'),
  suggestedAction: z.string().describe('Conservative next step (e.g., "Discuss this with your doctor at your next visit")'),
  uncertaintyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Level of confidence in the summary'),
  disclaimer: z.string().describe('Mandatory medical disclaimer'),
  proposedTools: z.array(z.object({
    toolName: z.string(),
    parameters: z.record(z.any()),
  })).optional().describe('Tools the agent proposes to use (e.g., "Schedule appointment")'),
});

export type PatientPortalAiOutput = z.infer<typeof PatientPortalAiOutputSchema>;

/**
 * Defines the layered prompt composition for the Patient Portal Agent.
 */
export const PATIENT_PORTAL_PROMPT_LAYERS = {
  system: "You are the Zenthea Patient Portal Agent, a safe and helpful assistant for patients.",
  policy: "Strictly adhere to HIPAA and GDPR. Never provide medical advice, diagnosis, or treatment recommendations. Always be calm and non-alarmist.",
  domain: "Your expertise is limited to explaining lab results, visit notes, and medications in plain language.",
  task: "Provide a clear, educational summary of the provided health data based on the user's query.",
  memory: "Refer to the provided patient context and previous interaction history where applicable.",
  input: "Patient Query: {{query}}\nHealth Data: {{data}}",
};

/**
 * TODO: Implement AiAgent class to handle prompt composition and runtime invocation.
 * Requirements:
 * - Uses shared AI runtime only.
 * - Layered prompts (system, policy, domain, task, memory, input).
 * - Structured output validation via Zod.
 * - Explicitly prohibit diagnosis or treatment advice.
 * - Outputs must be educational, calm, and non-alarmist.
 */
