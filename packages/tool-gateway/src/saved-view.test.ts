import * as assert from 'assert';
import { 
  OperatorAPI
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

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  constructor(private readonly events: GovernanceTimelineEvent[]) {}
  
  async query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]> {
    let filtered = [...this.events];
    if (filter.decision) {
      filtered = filtered.filter(e => (e as { decision: string }).decision === filter.decision);
    }
    return filtered;
  }

  async getEvent(): Promise<GovernanceTimelineEvent | null> {
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

  // 1. Unknown viewId returns ERROR DTO
  const unknownViewResult = await api.executeView('unknown-view');
  assert.strictEqual(unknownViewResult.outcome, 'ERROR');
  assert.strictEqual(unknownViewResult.reasonCode, 'UNKNOWN_VIEW_ID');
  console.log('✅ Unknown viewId rejection passed');

  // 2. View execution calls policy execution (no bypass)
  // 'security-exceptions' view uses 'recent-denied-tools' policy
  const viewResults = await api.executeView('security-exceptions');
  assert.strictEqual(viewResults.resultSummary.count, 1, 'Should return exactly 1 denied event');
  console.log('✅ View resolves to policy execution passed');

  // 3. Deterministic results (ignoring executionId and timestamp)
  const viewResults2 = await api.executeView('security-exceptions');
  assert.strictEqual(viewResults.id, viewResults2.id);
  assert.strictEqual(viewResults.kind, viewResults2.kind);
  assert.deepStrictEqual(viewResults.resultSummary, viewResults2.resultSummary);
  assert.deepStrictEqual(viewResults.pageInfo, viewResults2.pageInfo);
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
  
  // Direct policy execution
  const policyResult = await pagingApi.executePolicy('recent-denied-tools');
  // View execution
  const viewResult = await pagingApi.executeView('security-exceptions');
  
  assert.deepStrictEqual(viewResult.resultSummary, policyResult.resultSummary, 'View and policy execution should match');
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
