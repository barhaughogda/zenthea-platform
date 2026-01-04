# AI Runtime

Core AI runtime abstraction for the AI-platform-monorepo-starter platform. 

This package provides a controlled, provider-agnostic execution environment for AI models, enforcing safety, policy, and prompt governance.

## Guarantees

1.  **Provider Independence**: No model-specific SDK leakage. All providers must implement the `ModelProvider` interface.
2.  **Prompt Governance**: Enforces a strict 6-layer prompt architecture (System, Policy, Domain, Task, Memory, Input) as defined in ADR-004.
3.  **Tool Safety**:
    *   AI agents only **propose** tools; they never execute them.
    *   All tool proposals are validated against schema and risk levels.
    *   **Allowlist Support**: The runtime supports an explicit `allowedToolPatterns` allowlist (preferred).
    *   **Financial Safeguard**: If no allowlist is provided, the runtime defaults to blocking common financial/billing terms as a fail-safe.
4.  **Fail-Fast Execution**: Invalid inputs, malformed tool proposals, or policy violations trigger immediate failures to prevent unpredictable behavior.
5.  **Observability by Design**: Mandatory hooks for tracing invocation start/end, policy checks, tool proposals, and errors.
6.  **Compliance Enforcement**: Hooks for pre- and post-invocation policy checks to support HIPAA, GDPR, and other regulatory requirements.

## Boundaries

> **The AI runtime is not responsible for domain decisions, billing logic, or workflow orchestration.**

*   **No Tool Execution**: This package validates tool proposals but does NOT contain the logic to execute them. Execution is handled by domain services or orchestration layers.
*   **No Orchestration**: This package does not call external orchestration systems (like n8n). It provides the validated proposals that these systems can consume.
*   **No Business Logic**: Domain-specific logic remains in the services. The runtime provides the framework for AI to operate within those domains.
*   **No Persistent State**: The runtime is stateless. Persistence of AI interactions is managed via hooks or by the calling service.

## Usage

```typescript
import { AIRuntime, PromptLayer, RuntimeContext } from '@starter/ai-runtime';

const runtime = new AIRuntime({
  provider: myModelProvider,
  validation: {
    enforcePolicy: async (ctx, action, data) => {
      // Implement domain-specific policy
      return { allowed: true };
    }
  },
  observability: {
    onInvocationEnd: (result) => console.log('AI Cost:', result.usage.cost)
  }
});

const result = await runtime.execute(context, layers, { modelId: 'gpt-4o' });
```

## Related Documentation

*   `docs/10-decisions/adr-003-ai-runtime-abstraction.md`
*   `docs/10-decisions/adr-004-prompt-governance.md`
*   `docs/03-ai-platform/ai-runtime.md`
*   `docs/03-ai-platform/prompt-architecture.md`
*   `docs/03-ai-platform/tool-proposal-model.md`
