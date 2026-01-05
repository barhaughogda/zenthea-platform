import * as assert from 'assert';
import { PolicyEvaluator, generatePolicySnapshot } from './governance';

function testPolicyEvaluator() {
  const evaluator = new PolicyEvaluator();

  console.log('Running PolicyEvaluator tests...');

  // 1. Allow case
  const allowResult = evaluator.evaluate('patient-portal-agent', 'medical_advisor.getAdvice');
  assert.strictEqual(allowResult.allowed, true, 'Should allow patient-portal-agent to call medical_advisor.getAdvice');
  assert.strictEqual(allowResult.agentType, 'patient-facing');
  console.log('✅ Allow case passed');

  // 2. UNKNOWN_AGENT
  const unknownAgentResult = evaluator.evaluate('unknown-agent', 'chat.sendMessage');
  assert.strictEqual(unknownAgentResult.allowed, false);
  assert.strictEqual(unknownAgentResult.reasonCode, 'UNKNOWN_AGENT');
  assert.strictEqual(unknownAgentResult.agentType, 'unknown');
  console.log('✅ UNKNOWN_AGENT case passed');

  // 3. UNKNOWN_TOOL
  const unknownToolResult = evaluator.evaluate('consent-agent', 'unknown.tool');
  assert.strictEqual(unknownToolResult.allowed, false);
  assert.strictEqual(unknownToolResult.reasonCode, 'UNKNOWN_TOOL');
  assert.strictEqual(unknownToolResult.agentType, 'clinical');
  console.log('✅ UNKNOWN_TOOL case passed');

  // 4. SCOPE_DENIED
  const scopeDeniedResult = evaluator.evaluate('consent-agent', 'chat.sendMessage'); // consent-agent doesn't have chat.write
  assert.strictEqual(scopeDeniedResult.allowed, false);
  assert.strictEqual(scopeDeniedResult.reasonCode, 'SCOPE_DENIED');
  assert.strictEqual(scopeDeniedResult.agentType, 'clinical');
  console.log('✅ SCOPE_DENIED case passed');

  console.log('All PolicyEvaluator tests passed!');
}

function testPolicySnapshots() {
  console.log('Running PolicySnapshot tests...');

  // 1. Hash stability
  const snapshot1 = generatePolicySnapshot('1.0.0');
  const snapshot2 = generatePolicySnapshot('1.0.0');

  assert.strictEqual(snapshot1.policyHash, snapshot2.policyHash, 'Hashes should be identical for same policy');
  assert.notStrictEqual(snapshot1.snapshotId, snapshot2.snapshotId, 'Snapshot IDs should be unique');
  assert.strictEqual(snapshot1.agentCount > 0, true, 'Should count agents');
  assert.strictEqual(snapshot1.toolCount > 0, true, 'Should count tools');

  // 2. Metadata-only check (manual verification in code is enough, but checking fields exist)
  assert.strictEqual(typeof snapshot1.policyHash, 'string');
  assert.strictEqual(snapshot1.policyHash.length, 64); // SHA-256 hex length

  console.log('✅ PolicySnapshot tests passed!');
}

try {
  testPolicyEvaluator();
  testPolicySnapshots();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
