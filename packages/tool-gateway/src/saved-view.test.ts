import * as assert from 'assert';
import { 
  OperatorAPI, 
  OperatorTimelineResponseV1 
} from './operator-api';
import { 
  IGovernanceTimelineReader, 
  GovernanceTimelineEvent, 
  TimelineFilter 
} from './timeline';
import { 
  AgentRegistryReader
} from './agent-registry';
import { TimelineRegistryJoiner } from './timeline-registry-join';
import { SAVED_VIEW_REGISTRY } from './saved-view-registry';
import { POLICY_REGISTRY } from './policy-registry';

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  constructor(private readonly events: GovernanceTimelineEvent[]) {}
  
  async query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]> {
    let filtered = [...this.events];
    if (filter.decision) {
      filtered = filtered.filter(e => 'decision' in e && (e as any).decision === filter.decision);
    }
    return filtered;
  }

  async getEvent(_eventId: string): Promise<GovernanceTimelineEvent | null> {
    return this.events[0] || null;
  }
}

async function testSavedViews() {
  console.log('Running SavedView tests...');

  const events: GovernanceTimelineEvent[] = [
    {
      eventId: 'denied-1',
      type: 'TOOL_GATEWAY',
      policySnapshotHash: 'hash-1',
      agentVersion: '1.0.0',
      timestamp: '2025-01-01T12:00:00Z',
      toolName: 'chat.sendMessage',
      actorType: 'patient',
      decision: 'denied',
    },
    {
      eventId: 'allowed-1',
      type: 'TOOL_GATEWAY',
      policySnapshotHash: 'hash-1',
      agentVersion: '1.0.0',
      timestamp: '2025-01-01T13:00:00Z',
      toolName: 'chat.sendMessage',
      actorType: 'patient',
      decision: 'allowed',
    },
  ];

  const timelineReader = new MockTimelineReader(events);
  const registryReader = new AgentRegistryReader();
  const joiner = new TimelineRegistryJoiner(registryReader);
  const api = new OperatorAPI(timelineReader, registryReader, joiner);

  // 1. Unknown viewId rejected
  try {
    await api.executeView('unknown-view');
    assert.fail('Should have rejected unknown viewId');
  } catch (err: any) {
    assert.ok(err.message.includes('Unknown viewId'), 'Error message should mention unknown viewId');
  }
  console.log('✅ Unknown viewId rejection passed');

  // 2. View execution calls policy execution (no bypass)
  // 'security-exceptions' view uses 'recent-denied-tools' policy
  const viewResults = await api.executeView('security-exceptions') as OperatorTimelineResponseV1;
  assert.strictEqual(viewResults.count, 1, 'Should return exactly 1 denied event');
  assert.strictEqual(viewResults.items[0].eventId, 'denied-1');
  console.log('✅ View resolves to policy execution passed');

  // 3. Deterministic results
  const viewResults2 = await api.executeView('security-exceptions') as OperatorTimelineResponseV1;
  assert.deepStrictEqual(viewResults, viewResults2, 'Results should be deterministic');
  console.log('✅ Deterministic results passed');

  // 4. Pagination parity vs direct policy execution
  const manyDeniedEvents: GovernanceTimelineEvent[] = Array.from({ length: 10 }, (_, i) => ({
    eventId: `denied-${i}`,
    type: 'TOOL_GATEWAY',
    policySnapshotHash: 'hash-1',
    agentVersion: '1.0.0',
    timestamp: `2025-01-01T12:00:${i.toString().padStart(2, '0')}Z`,
    decision: 'denied',
    toolName: 'chat.sendMessage',
    actorType: 'patient',
  }));
  const pagingApi = new OperatorAPI(new MockTimelineReader(manyDeniedEvents), registryReader, joiner);
  
  // Direct policy execution page 1
  const policyPage1 = await pagingApi.executePolicy('recent-denied-tools') as OperatorTimelineResponseV1;
  // View execution page 1
  const viewPage1 = await pagingApi.executeView('security-exceptions') as OperatorTimelineResponseV1;
  
  assert.deepStrictEqual(viewPage1, policyPage1, 'View and policy execution should match');
  
  // Test pagination cursor
  if (viewPage1.nextCursor) {
    const viewPage2 = await pagingApi.executeView('security-exceptions', viewPage1.nextCursor) as OperatorTimelineResponseV1;
    const policyPage2 = await pagingApi.executePolicy('recent-denied-tools', policyPage1.nextCursor!) as OperatorTimelineResponseV1;
    assert.deepStrictEqual(viewPage2, policyPage2, 'Pagination cursor should match between view and policy');
    assert.strictEqual(viewPage2.items[0].eventId, 'denied-5');
  }
  console.log('✅ Pagination parity passed');

  // 5. Registry validation
  assert.ok(SAVED_VIEW_REGISTRY['clinical-overview'], 'Registry should contain clinical-overview');
  assert.ok(SAVED_VIEW_REGISTRY['security-exceptions'], 'Registry should contain security-exceptions');
  console.log('✅ Registry presence passed');

  console.log('All SavedView tests passed! 🛡️');
}

testSavedViews().catch(err => {
  console.error('❌ Tests failed:');
  console.error(err);
  process.exit(1);
});
