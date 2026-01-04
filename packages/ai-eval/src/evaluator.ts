import { 
  AIRuntime, 
  RuntimeContext, 
  PromptLayer, 
  ModelInvocationOptions,
  ModelInvocationResult
} from '@starter/ai-runtime';
import { EvaluationHooks, EvalThresholds } from './hooks';

export interface GoldenTest {
  name: string;
  context: RuntimeContext;
  layers: PromptLayer[];
  options: ModelInvocationOptions;
  assertions: {
    contains?: string[];
    notContains?: string[];
    matchesRegex?: string[];
    minTokens?: number;
    maxTokens?: number;
  };
}

export interface TestReport {
  name: string;
  passed: boolean;
  errors: string[];
  metrics: {
    latencyMs: number;
    tokens: number;
    cost?: number;
  };
}

export class AIEvaluator {
  constructor(
    private readonly runtime: AIRuntime,
    private readonly thresholds: EvalThresholds = {}
  ) {}

  public async runTest(test: GoldenTest): Promise<TestReport> {
    const hooks = new EvaluationHooks(this.thresholds);
    
    // We need to ensure the runtime uses our hooks
    // In a real scenario, we might need a way to inject hooks into an existing runtime 
    // or create a new one for the test.
    
    const errors: string[] = [];
    let result: ModelInvocationResult;
    let latency = 0;
    const start = Date.now();

    try {
      result = await this.runtime.execute(test.context, test.layers, test.options);
      latency = Date.now() - start;

      // 1. Content Assertions
      if (test.assertions.contains) {
        for (const str of test.assertions.contains) {
          if (!result.content.includes(str)) {
            errors.push(`Output missing expected string: "${str}"`);
          }
        }
      }

      if (test.assertions.notContains) {
        for (const str of test.assertions.notContains) {
          if (result.content.includes(str)) {
            errors.push(`Output contains prohibited string: "${str}"`);
          }
        }
      }

      // 2. Token Assertions
      if (test.assertions.maxTokens && result.usage.totalTokens > test.assertions.maxTokens) {
        errors.push(`Token count ${result.usage.totalTokens} exceeds maximum ${test.assertions.maxTokens}`);
      }

    } catch (e: any) {
      errors.push(`Execution error: ${e.message}`);
      return {
        name: test.name,
        passed: false,
        errors,
        metrics: { latencyMs: Date.now() - start, tokens: 0 }
      };
    }

    const passed = errors.length === 0;

    return {
      name: test.name,
      passed,
      errors,
      metrics: {
        latencyMs: latency,
        tokens: result.usage.totalTokens,
        cost: result.usage.cost
      }
    };
  }

  public async runSuite(tests: GoldenTest[]): Promise<TestReport[]> {
    const reports: TestReport[] = [];
    for (const test of tests) {
      reports.push(await this.runTest(test));
    }
    return reports;
  }
}
