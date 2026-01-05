import * as assert from 'assert';
import { PolicyEvaluator } from './governance';

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

  console.log('All tests passed!');
}

try {
  testPolicyEvaluator();
} catch (error) {
  console.error('Test failed:', error);
  process.exit(1);
}
