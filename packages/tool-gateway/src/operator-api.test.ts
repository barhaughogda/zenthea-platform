import * as assert from 'assert';
import { OperatorAPI } from './operator-api';
import { 
  IGovernanceTimelineReader, 
  GovernanceTimelineEvent, 
  TimelineFilter 
} from './timeline';
import { 
  AgentRegistryReader, 
  AgentRegistryEntry
} from './agent-registry';
import { TimelineRegistryJoiner } from './timeline-registry-join';

/**
 * Mock Timeline Reader for testing.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  constructor(private readonly events: GovernanceTimelineEvent[]) {}
  
  async query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]> {
    let filtered = [...this.events];
    if (filter.agentVersion) {
      filtered = filtered.filter(e => e.agentVersion === filter.agentVersion);
    }
    if (filter.toolName) {
      filtered = filtered.filter(e => 'toolName' in e && (e as any).toolName === filter.toolName);
    }
    if (filter.decision) {
      filtered = filtered.filter(e => 'decision' in e && (e as any).decision === filter.decision);
    }
    return filtered;
  }

  async getEvent(_eventId: string): Promise<GovernanceTimelineEvent | null> {
    return this.events[0] || null;
  }
}

async function testOperatorAPI() {
  console.log('Running OperatorAPI tests...');

  const events: GovernanceTimelineEvent[] = [
    {
      eventId: 'req-1',
      type: 'TOOL_GATEWAY',
      policySnapshotHash: 'hash-1',
      agentVersion: '1.0.0',
      timestamp: '2025-01-01T12:00:00Z',
      toolName: 'chat.sendMessage',
      actorType: 'patient',
      decision: 'allowed',
    },
    {
      eventId: 'gov-1',
      type: 'GOVERNANCE_CONTROL',
      policySnapshotHash: 'hash-1',
      agentVersion: '1.0.0',
      timestamp: '2025-01-01T10:00:00Z',
      decision: 'DENIED',
      reasonCode: 'LIFECYCLE_DENIED',
      toolName: 'createConsent',
      agentType: 'clinical',
    },
  ];

  const timelineReader = new MockTimelineReader(events);
  const registryReader = new AgentRegistryReader();
  const joiner = new TimelineRegistryJoiner(registryReader);
  const api = new OperatorAPI(timelineReader, registryReader, joiner);

  // 1. getTimeline - Check data and ordering
  const timelineResponse = await api.getTimeline({});
  assert.strictEqual(timelineResponse.version, 'v1');
  assert.strictEqual(timelineResponse.count, 2);
  assert.strictEqual(timelineResponse.items[0].timestamp, '2025-01-01T10:00:00Z', 'Should be sorted chronologically');
  console.log('✅ getTimeline passed');

  // 2. getAgents - Check data and count
  const agentsResponse = await api.getAgents();
  assert.strictEqual(agentsResponse.version, 'v1');
  assert.ok(agentsResponse.count > 0);
  assert.ok(Array.isArray(agentsResponse.items));
  console.log('✅ getAgents passed');

  // 3. getEnrichedTimeline - Check join and data
  const enrichedResponse = await api.getEnrichedTimeline({});
  assert.strictEqual(enrichedResponse.version, 'v1');
  assert.strictEqual(enrichedResponse.count, 2);
  assert.strictEqual(enrichedResponse.items[0].timestamp, '2025-01-01T10:00:00Z', 'Should be sorted chronologically');
  assert.ok(enrichedResponse.items[0].agent, 'Should have joined agent data or "unknown"');
  console.log('✅ getEnrichedTimeline passed');

  // 4. 🚫 Security - Forbidden fields in response contracts
  const responses = [timelineResponse, agentsResponse, enrichedResponse] as any[];
  
  const forbiddenFields = ['tenantId', 'actorId', 'requestId', 'idempotencyKey', 'payload'];

  for (const res of responses) {
    // Check root
    forbiddenFields.forEach(field => {
      assert.strictEqual(res[field], undefined, `Response must NOT contain ${field}`);
    });

    // Check nested items
    const items = res.items;
    items.forEach((item: any) => {
      forbiddenFields.forEach(field => {
        assert.strictEqual(item[field], undefined, `Item must NOT contain ${field}`);
      });
      
      // Enriched timeline specific nested check
      if (item.timelineEvent) {
        forbiddenFields.forEach(field => {
          assert.strictEqual(item.timelineEvent[field], undefined, `timelineEvent must NOT contain ${field}`);
        });
      }
    });
  }
  console.log('✅ Security (forbidden fields) passed');

  // 5. Filtering - Timeline Valid filters
  const filteredTimeline = await api.getTimeline({ agentVersion: '1.0.0' });
  assert.strictEqual(filteredTimeline.count, 2);
  const emptyTimeline = await api.getTimeline({ agentVersion: '2.0.0' });
  assert.strictEqual(emptyTimeline.count, 0);
  console.log('✅ getTimeline filtering passed');

  // 6. Filtering - Registry Valid filters
  const filteredAgents = await api.getAgents({ agentId: 'medical-advisor-agent' });
  assert.ok(filteredAgents.items.every(a => a.agentId === 'medical-advisor-agent'));
  console.log('✅ getAgents filtering passed');

  // 7. Filtering - Invalid filters (should throw)
  try {
    await (api as any).getTimeline({ forbiddenField: 'attack' });
    assert.fail('Should have rejected unknown filter');
  } catch (err: any) {
    assert.ok(err.message.includes('unrecognized_keys') || err.name === 'ZodError');
  }
  console.log('✅ Reject unknown filters passed');

  // 8. Filtering + Pagination
  // Add more events for pagination test
  const manyEvents: GovernanceTimelineEvent[] = Array.from({ length: 10 }, (_, i) => ({
    eventId: `req-${i}`,
    type: 'TOOL_GATEWAY',
    policySnapshotHash: 'hash-1',
    agentVersion: '1.0.0',
    timestamp: `2025-01-01T12:00:${i.toString().padStart(2, '0')}Z`,
    toolName: 'chat.sendMessage',
    actorType: 'patient',
    decision: 'allowed',
  }));
  const pagingApi = new OperatorAPI(new MockTimelineReader(manyEvents), registryReader, joiner);
  
  const page1 = await pagingApi.getTimeline({ limit: 5 });
  assert.strictEqual(page1.items.length, 5);
  assert.ok(page1.nextCursor);
  assert.strictEqual(page1.hasMore, true);

  const page2 = await pagingApi.getTimeline({ limit: 5, cursor: page1.nextCursor! });
  assert.strictEqual(page2.items.length, 5);
  assert.strictEqual(page2.hasMore, false);
  assert.strictEqual(page2.items[0].eventId, 'req-5');
  console.log('✅ Filtering + Pagination passed');

  // 9. Read-only - No write paths
  const apiPrototype = Object.getPrototypeOf(api);
  const methodNames = Object.getOwnPropertyNames(apiPrototype);
  const writeMethods = methodNames.filter(name => 
    name.startsWith('set') || 
    name.startsWith('update') || 
    name.startsWith('delete') || 
    name.startsWith('create') ||
    name.startsWith('post') ||
    name.startsWith('put') ||
    name.startsWith('patch')
  );
  assert.strictEqual(writeMethods.length, 0, 'OperatorAPI MUST NOT have write methods');
  console.log('✅ Read-only (no write paths) passed');

  console.log('All OperatorAPI tests passed! 🛡️');
}

testOperatorAPI().catch(err => {
  console.error('❌ Tests failed:');
  console.error(err);
  process.exit(1);
});
