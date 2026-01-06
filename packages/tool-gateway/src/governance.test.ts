import * as assert from 'assert';
import { PolicyEvaluator, generatePolicySnapshot } from './governance';

function testPolicyEvaluator() {
  const evaluator = new PolicyEvaluator();

  console.log('Running PolicyEvaluator tests...');

  // 1. Allow case (Active version)
  const allowResult = evaluator.evaluate('patient-portal-agent', '1.0.0', 'medical_advisor.getAdvice');
  assert.strictEqual(allowResult.allowed, true, 'Should allow patient-portal-agent (1.0.0) to call medical_advisor.getAdvice');
  assert.strictEqual(allowResult.agentType, 'patient-facing');
  assert.strictEqual(allowResult.warningCode, undefined);
  console.log('✅ Allow case (Active) passed');

  // 2. UNKNOWN_AGENT
  const unknownAgentResult = evaluator.evaluate('unknown-agent', '1.0.0', 'chat.sendMessage');
  assert.strictEqual(unknownAgentResult.allowed, false);
  assert.strictEqual(unknownAgentResult.reasonCode, 'UNKNOWN_AGENT');
  assert.strictEqual(unknownAgentResult.agentType, 'unknown');
  console.log('✅ UNKNOWN_AGENT case passed');

  // 3. UNKNOWN_AGENT_VERSION
  const unknownVersionResult = evaluator.evaluate('patient-portal-agent', '9.9.9', 'chat.sendMessage');
  assert.strictEqual(unknownVersionResult.allowed, false);
  assert.strictEqual(unknownVersionResult.reasonCode, 'UNKNOWN_AGENT_VERSION');
  assert.strictEqual(unknownVersionResult.agentType, 'patient-facing');
  console.log('✅ UNKNOWN_AGENT_VERSION case passed');

  // 4. UNKNOWN_TOOL
  const unknownToolResult = evaluator.evaluate('consent-agent', '1.0.0', 'unknown.tool');
  assert.strictEqual(unknownToolResult.allowed, false);
  assert.strictEqual(unknownToolResult.reasonCode, 'UNKNOWN_TOOL');
  assert.strictEqual(unknownToolResult.agentType, 'clinical');
  console.log('✅ UNKNOWN_TOOL case passed');

  // 5. SCOPE_DENIED
  const scopeDeniedResult = evaluator.evaluate('consent-agent', '1.0.0', 'chat.sendMessage');
  assert.strictEqual(scopeDeniedResult.allowed, false);
  assert.strictEqual(scopeDeniedResult.reasonCode, 'SCOPE_DENIED');
  assert.strictEqual(scopeDeniedResult.agentType, 'clinical');
  console.log('✅ SCOPE_DENIED case passed');

  // 6. Deprecated Version (Warning)
  const deprecatedResult = evaluator.evaluate('test-agent', 'deprecated-v1', 'chat.getHistory');
  assert.strictEqual(deprecatedResult.allowed, true);
  assert.strictEqual(deprecatedResult.warningCode, 'DEPRECATED_AGENT');
  console.log('✅ Deprecated Version (Warning) passed');

  // 7. Disabled Version (Deny)
  const disabledResult = evaluator.evaluate('test-agent', 'disabled-v1', 'chat.getHistory');
  assert.strictEqual(disabledResult.allowed, false);
  assert.strictEqual(disabledResult.reasonCode, 'LIFECYCLE_DENIED');
  console.log('✅ Disabled Version (Deny) passed');

  // 8. Retired Version (Deny)
  const retiredResult = evaluator.evaluate('test-agent', 'retired-v1', 'chat.getHistory');
  assert.strictEqual(retiredResult.allowed, false);
  assert.strictEqual(retiredResult.reasonCode, 'LIFECYCLE_DENIED');
  console.log('✅ Retired Version (Deny) passed');

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

  // 2. Metadata-only check
  assert.strictEqual(typeof snapshot1.policyHash, 'string');
  assert.strictEqual(snapshot1.policyHash.length, 64);

  console.log('✅ PolicySnapshot tests passed!');
}

function testLifecycleTransitions() {
  const evaluator = new PolicyEvaluator();
  console.log('Running LifecycleTransition tests...');

  // 1. Allowed Transitions
  const allowed = [
    { from: 'experimental', to: 'active' },
    { from: 'active', to: 'deprecated' },
    { from: 'deprecated', to: 'retired' },
    { from: 'active', to: 'disabled' },
    { from: 'deprecated', to: 'disabled' },
    { from: 'active', to: 'active' }, // Identity
  ];

  for (const { from, to } of allowed) {
    const result = evaluator.validateTransition(from as any, to as any);
    assert.strictEqual(result.allowed, true, `Transition ${from} -> ${to} should be allowed`);
  }
  console.log('✅ Allowed transitions passed');

  // 2. Forbidden Transitions
  const forbidden = [
    { from: 'retired', to: 'active' },
    { from: 'retired', to: 'experimental' },
    { from: 'disabled', to: 'active' },
    { from: 'active', to: 'experimental' },
    { from: 'retired', to: 'deprecated' },
    { from: 'disabled', to: 'retired' },
  ];

  for (const { from, to } of forbidden) {
    const result = evaluator.validateTransition(from as any, to as any);
    assert.strictEqual(result.allowed, false, `Transition ${from} -> ${to} should be forbidden`);
    assert.strictEqual(result.reasonCode, 'LIFECYCLE_DENIED');
  }
  console.log('✅ Forbidden transitions passed');

  console.log('All LifecycleTransition tests passed!');
}

try {
  testPolicyEvaluator();
  testPolicySnapshots();
  testLifecycleTransitions();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
