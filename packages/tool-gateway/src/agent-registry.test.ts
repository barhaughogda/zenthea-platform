import * as assert from 'assert';
import { AgentRegistryReader } from './agent-registry';
import { AGENT_REGISTRY, generatePolicySnapshot } from './governance';

function testAgentRegistryReader() {
  console.log('Running AgentRegistryReader tests...');
  const reader = new AgentRegistryReader();
  const snapshot = generatePolicySnapshot();

  // 1. listAgents - Correct projection & Stable ordering
  const agents = reader.listAgents();
  const expectedTotalVersions = Object.values(AGENT_REGISTRY).reduce(
    (sum, agent) => sum + Object.keys(agent.versions).length, 
    0
  );

  assert.strictEqual(agents.length, expectedTotalVersions, 'Should return all versions');
  
  // Verify ordering
  for (let i = 0; i < agents.length - 1; i++) {
    const current = agents[i];
    const next = agents[i + 1];
    const order = current.agentId.localeCompare(next.agentId);
    if (order === 0) {
      assert.ok(current.agentVersion.localeCompare(next.agentVersion) <= 0, 'Versions should be sorted');
    } else {
      assert.ok(order < 0, 'Agent IDs should be sorted');
    }
  }
  console.log('✅ listAgents ordering and count passed');

  // 2. Metadata projection
  const first = agents[0];
  assert.ok(first.agentId, 'agentId should be present');
  assert.ok(first.agentVersion, 'agentVersion should be present');
  assert.ok(first.agentType, 'agentType should be present');
  assert.ok(first.lifecycleState, 'lifecycleState should be present');
  assert.ok(Array.isArray(first.allowedScopes), 'allowedScopes should be array');
  assert.strictEqual(first.policySnapshotHash, snapshot.policyHash, 'Should match policy hash');
  assert.ok(first.lastUpdatedAt, 'lastUpdatedAt should be present');
  console.log('✅ Metadata projection passed');

  // 3. 🚫 Security - Forbidden fields
  agents.forEach(agent => {
    const keys = Object.keys(agent);
    assert.strictEqual(keys.includes('tenantId'), false, 'MUST NOT include tenantId');
    assert.strictEqual(keys.includes('actorId'), false, 'MUST NOT include actorId');
    assert.strictEqual(keys.includes('requestId'), false, 'MUST NOT include requestId');
    assert.strictEqual(keys.includes('payload'), false, 'MUST NOT include payload');
  });
  console.log('✅ Security (no forbidden fields) passed');

  // 4. getAgent
  const agentId = 'test-agent';
  const versions = reader.getAgent(agentId);
  const expectedCount = Object.keys(AGENT_REGISTRY[agentId].versions).length;
  assert.strictEqual(versions.length, expectedCount, 'Should return all versions for agent');
  assert.ok(versions.every(v => v.agentId === agentId), 'All versions should match agentId');
  
  const unknownAgent = reader.getAgent('non-existent');
  assert.strictEqual(unknownAgent.length, 0, 'Should return empty array for unknown agent');
  console.log('✅ getAgent passed');

  // 5. getAgentVersion
  const portalAgentId = 'patient-portal-agent';
  const v1 = reader.getAgentVersion(portalAgentId, '1.0.0');
  assert.ok(v1, 'Should find version 1.0.0');
  assert.strictEqual(v1?.agentType, 'patient-facing');
  assert.strictEqual(v1?.lifecycleState, 'active');

  const unknownV = reader.getAgentVersion(portalAgentId, '9.9.9');
  assert.strictEqual(unknownV, undefined, 'Should return undefined for unknown version');
  console.log('✅ getAgentVersion passed');

  console.log('All AgentRegistryReader tests passed! 🚀');
}

// Execute tests
try {
  testAgentRegistryReader();
} catch (error) {
  console.error('❌ Tests failed:');
  console.error(error);
  process.exit(1);
}
