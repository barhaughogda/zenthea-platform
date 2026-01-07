import * as assert from 'assert';
import { VersionResolver } from './versioning/resolvers';
import { ToolExecutionGateway } from './gateway';
import { PolicyEvaluator } from './governance';
import { MockMutationExecutor } from './mock-executor';
import { Cacheability } from './performance/cache-boundaries';

async function testSlice19() {
  console.log('Running Slice 19 (Performance & Caching Boundaries) tests...');

  // 1. Boundary Annotations
  console.log('Testing boundary annotations...');
  assert.strictEqual((VersionResolver as any).cacheability, Cacheability.METADATA_ONLY, 'VersionResolver should be METADATA_ONLY');
  assert.strictEqual((ToolExecutionGateway as any).cacheability, Cacheability.NONE, 'ToolExecutionGateway should be NONE');
  assert.strictEqual((PolicyEvaluator as any).cacheability, Cacheability.NONE, 'PolicyEvaluator should be NONE');
  assert.strictEqual((MockMutationExecutor as any).cacheability, Cacheability.NONE, 'MockMutationExecutor should be NONE');
  console.log('✅ Boundary annotations verified');

  // 2. Guarded Memoization (VersionResolver)
  console.log('Testing guarded memoization...');
  const policyId = 'active-clinical-agents';
  const version = '1';

  const firstCall = VersionResolver.resolvePolicy(policyId, version);
  const secondCall = VersionResolver.resolvePolicy(policyId, version);

  // Reference equality check
  assert.strictEqual(firstCall, secondCall, 'Memoization should return identical object reference');

  const policyA = VersionResolver.resolvePolicy('active-clinical-agents', '1');
  const policyB = VersionResolver.resolvePolicy('recent-denied-tools', '1');
  assert.notStrictEqual(policyA, policyB, 'Different policies should have different references');

  const latestFirst = VersionResolver.resolvePolicy(policyId);
  const latestSecond = VersionResolver.resolvePolicy(policyId);
  assert.strictEqual(latestFirst, latestSecond, 'Latest resolution should be memoized');
  console.log('✅ Guarded memoization verified');

  // 3. Execution Path Determinism (Non-cacheability)
  console.log('Testing execution path non-cacheability...');
  const mockAuditLogger = { log: async () => {} } as any;
  const gateway = new ToolExecutionGateway(mockAuditLogger);
  
  const command = {
    commandId: '809d3752-160d-4b9d-8d2a-7e3f6d7e9b01',
    proposalId: '809d3752-160d-4b9d-8d2a-7e3f6d7e9b02',
    tenantId: 'tenant-123',
    agentId: 'patient-portal-agent',
    agentVersion: '1.0.0',
    tool: { name: 'chat.getHistory', version: '1' },
    parameters: { patientId: 'actor-456' },
    approval: {
      approvedBy: 'actor-456',
      approvedAt: new Date().toISOString(),
      approvalType: 'human'
    },
    idempotencyKey: 'key-789',
    metadata: { correlationId: 'corr-001' }
  };

  const res1 = await gateway.execute(command);
  const res2 = await gateway.execute(command);

  // Execution IDs must be different because chat.getHistory is NOT a mutation (not in TOOL_ALLOWLIST)
  // so the gateway does not use idempotency/caching for it.
  assert.notStrictEqual(res1.executionId, res2.executionId, 'Execution paths must produce unique results');
  console.log('✅ Execution path non-cacheability verified');

  console.log('All Slice 19 tests passed! 🎯');
}

testSlice19().catch(err => {
  console.error('❌ Slice 19 Tests failed:');
  console.error(err);
  process.exit(1);
});
