import * as assert from 'assert';
import { TimelineRegistryJoiner } from './timeline-registry-join';
import { IAgentRegistryReader, AgentRegistryEntry } from './agent-registry';
import { GovernanceTimelineEvent } from './timeline';

/**
 * Mock Registry Reader for controlled testing.
 */
class MockRegistryReader implements IAgentRegistryReader {
  constructor(private entries: AgentRegistryEntry[]) {}
  listAgents(): AgentRegistryEntry[] { return this.entries; }
  getAgent(agentId: string): AgentRegistryEntry[] { 
    return this.entries.filter(e => e.agentId === agentId); 
  }
  getAgentVersion(agentId: string, agentVersion: string): AgentRegistryEntry | undefined {
    return this.entries.find(e => e.agentId === agentId && e.agentVersion === agentVersion);
  }
}

function testTimelineRegistryJoin() {
  console.log('Running TimelineRegistryJoiner tests...');

  const policyHash = 'hash-123';
  const agentId = 'test-agent';
  const version = '1.0.0';

  const registryEntry: AgentRegistryEntry = {
    agentId,
    agentVersion: version,
    agentType: 'patient-facing',
    lifecycleState: 'active',
    allowedScopes: ['chat.read'],
    policySnapshotHash: policyHash,
    lastUpdatedAt: '2025-01-01T00:00:00Z',
  };

  const reader = new MockRegistryReader([registryEntry]);
  const joiner = new TimelineRegistryJoiner(reader);

  // 1. Successful Join
  const event: GovernanceTimelineEvent = {
    eventId: 'req-1',
    type: 'TOOL_GATEWAY',
    policySnapshotHash: policyHash,
    agentVersion: version,
    timestamp: '2025-01-01T10:00:00Z',
    toolName: 'chat.sendMessage',
    actorType: 'patient',
    decision: 'allowed',
  };

  const results = joiner.join([event]);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].agent !== 'unknown', true, 'Should join successfully');
  if (results[0].agent !== 'unknown') {
    assert.strictEqual(results[0].agent.agentId, agentId);
    assert.strictEqual(results[0].agent.agentVersion, version);
  }
  console.log('✅ Successful join passed');

  // 2. Missing Registry Entry (Wrong Hash)
  const eventWrongHash: GovernanceTimelineEvent = {
    ...event,
    policySnapshotHash: 'wrong-hash',
  };
  const resultsWrongHash = joiner.join([eventWrongHash]);
  assert.strictEqual(resultsWrongHash[0].agent, 'unknown', 'Should be unknown for mismatched hash');
  console.log('✅ Mismatched hash join passed');

  // 3. Missing Registry Entry (Wrong Version)
  const eventWrongVersion: GovernanceTimelineEvent = {
    ...event,
    agentVersion: '2.0.0',
  };
  const resultsWrongVersion = joiner.join([eventWrongVersion]);
  assert.strictEqual(resultsWrongVersion[0].agent, 'unknown', 'Should be unknown for mismatched version');
  console.log('✅ Mismatched version join passed');

  // 4. 🚫 Security - Forbidden fields in output
  const forbiddenFields = ['tenantId', 'actorId', 'requestId', 'idempotencyKey', 'payload'];
  results.forEach(entry => {
    const entryKeys = Object.keys(entry);
    forbiddenFields.forEach(f => {
      assert.strictEqual(entryKeys.includes(f), false, `Entry MUST NOT include ${f}`);
    });

    if (entry.agent !== 'unknown') {
      const agentKeys = Object.keys(entry.agent);
      forbiddenFields.forEach(f => {
        assert.strictEqual(agentKeys.includes(f), false, `Agent metadata MUST NOT include ${f}`);
      });
    }
  });
  console.log('✅ Security (no forbidden fields) passed');

  // 5. Deterministic ordering (stable output relative to input)
  const event2: GovernanceTimelineEvent = {
    ...event,
    eventId: 'req-2',
    timestamp: '2025-01-01T11:00:00Z',
  };
  const resultsOrder = joiner.join([event2, event]);
  assert.strictEqual(resultsOrder[0].timestamp, event2.timestamp);
  assert.strictEqual(resultsOrder[1].timestamp, event.timestamp);
  console.log('✅ Deterministic ordering (stable output) passed');

  console.log('All TimelineRegistryJoiner tests passed! 🚀');
}

try {
  testTimelineRegistryJoin();
} catch (error) {
  console.error('❌ Tests failed:');
  console.error(error);
  process.exit(1);
}
