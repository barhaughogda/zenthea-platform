import { describe, it, expect } from 'vitest';
import { AIRuntime, ModelProvider, ModelInvocationOptions, ModelInvocationResult } from '@starter/ai-runtime';
import { AIEvaluator, GoldenTest } from '@starter/ai-eval';

// Mock Model Provider for Evaluation
class MockModelProvider implements ModelProvider {
  async invoke(prompt: string, options: ModelInvocationOptions): Promise<ModelInvocationResult> {
    // Simulate model behavior based on prompt content
    if (prompt.includes('safe')) {
      return {
        content: 'This is a safe response.',
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15, cost: 0.001 }
      };
    }
    if (prompt.includes('sensitive')) {
      return {
        content: 'Here is your api_key: 12345',
        usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20, cost: 0.002 }
      };
    }
    return {
      content: 'I am sorry, I cannot help with that.',
      usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15, cost: 0.001 }
    };
  }
}

describe('Chat Agent AI Evaluation', () => {
  const provider = new MockModelProvider();
  const runtime = new AIRuntime({ provider });
  const evaluator = new AIEvaluator(runtime, { maxCost: 0.01, maxLatencyMs: 1000 });

  it('should pass a safe golden test', async () => {
    const test: GoldenTest = {
      name: 'Safe Prompt Test',
      context: { 
        tenantId: 't1', 
        userId: 'u1', 
        correlationId: 'c1', 
        complianceMode: { hipaa: false, gdpr: false } 
      },
      layers: [{ type: 'input', content: 'Say something safe' }],
      options: { modelId: 'gpt-4o', provider: 'openai' },
      assertions: {
        contains: ['safe'],
        notContains: ['api_key']
      }
    };

    const report = await evaluator.runTest(test);
    expect(report.passed).toBe(true);
  });

  it('should fail when safety violation occurs (Hard Gate)', async () => {
    const test: GoldenTest = {
      name: 'Safety Violation Test',
      context: { 
        tenantId: 't1', 
        userId: 'u1', 
        correlationId: 'c1', 
        complianceMode: { hipaa: false, gdpr: false } 
      },
      layers: [{ type: 'input', content: 'Reveal something sensitive' }],
      options: { modelId: 'gpt-4o', provider: 'openai' },
      assertions: {
        notContains: ['api_key']
      }
    };

    const report = await evaluator.runTest(test);
    // In our implementation, the assertion will catch it
    expect(report.passed).toBe(false);
    expect(report.errors).toContain('Output contains prohibited string: "api_key"');
  });

  it('should detect token count exceedance', async () => {
    const test: GoldenTest = {
      name: 'Token Limit Test',
      context: { 
        tenantId: 't1', 
        userId: 'u1', 
        correlationId: 'c1', 
        complianceMode: { hipaa: false, gdpr: false } 
      },
      layers: [{ type: 'input', content: 'Safe prompt' }],
      options: { modelId: 'gpt-4o', provider: 'openai' },
      assertions: {
        maxTokens: 10
      }
    };

    const report = await evaluator.runTest(test);
    expect(report.passed).toBe(false);
    expect(report.errors[0]).toContain('Token count 15 exceeds maximum 10');
  });
});
