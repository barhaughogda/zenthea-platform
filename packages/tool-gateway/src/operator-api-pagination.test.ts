import * as assert from 'assert';
import { OperatorAPI } from './operator-api';
import { 
  IGovernanceTimelineReader, 
  GovernanceTimelineEvent, 
  TimelineFilter 
} from './timeline';
import { 
  AgentRegistryReader
} from './agent-registry';
import { TimelineRegistryJoiner } from './timeline-registry-join';
import { decodeCursorV1 } from './cursor';

/**
 * Mock Timeline Reader for testing pagination.
 */
class MockTimelineReader implements IGovernanceTimelineReader {
  constructor(private readonly events: GovernanceTimelineEvent[]) {}
  
  async query(filter: TimelineFilter): Promise<GovernanceTimelineEvent[]> {
    let result = [...this.events];

    // Simple chronological sort for mock
    result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (filter.cursor) {
      const decoded = decodeCursorV1(filter.cursor);
      if (decoded) {
        const startIndex = result.findIndex(e => 
          e.timestamp === decoded.timestamp && e.eventId === decoded.secondaryKey
        ) + 1;
        result = result.slice(startIndex);
      }
    }

    if (filter.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  async getEvent(eventId: string): Promise<GovernanceTimelineEvent | null> {
    return this.events.find(e => e.eventId === eventId) || null;
  }
}

async function testPagination() {
  console.log('Running OperatorAPI Pagination tests...');

  // Create 10 events
  const events: GovernanceTimelineEvent[] = Array.from({ length: 10 }, (_, i) => ({
    eventId: `event-${i}`,
    type: 'TOOL_GATEWAY',
    policySnapshotHash: 'hash-1',
    agentVersion: '1.0.0',
    timestamp: `2025-01-01T10:00:${i.toString().padStart(2, '0')}Z`,
    toolName: 'chat.sendMessage',
    actorType: 'patient',
    decision: 'allowed',
  }));

  const timelineReader = new MockTimelineReader(events);
  const registryReader = new AgentRegistryReader();
  const joiner = new TimelineRegistryJoiner(registryReader);
  const api = new OperatorAPI(timelineReader, registryReader, joiner);

  // 1. First Page (limit 3)
  const page1 = await api.getTimeline({ limit: 3 });
  assert.strictEqual(page1.items.length, 3);
  assert.strictEqual(page1.hasMore, true);
  assert.ok(page1.nextCursor);
  assert.strictEqual(page1.items[0].eventId, 'event-0');
  assert.strictEqual(page1.items[2].eventId, 'event-2');
  console.log('✅ Page 1 passed');

  // 2. Second Page (using cursor from page 1, limit 3)
  const page2 = await api.getTimeline({ limit: 3, cursor: page1.nextCursor! });
  assert.strictEqual(page2.items.length, 3);
  assert.strictEqual(page2.hasMore, true);
  assert.ok(page2.nextCursor);
  assert.strictEqual(page2.items[0].eventId, 'event-3');
  assert.strictEqual(page2.items[2].eventId, 'event-5');
  console.log('✅ Page 2 passed');

  // 3. Third Page (using cursor from page 2, limit 3)
  const page3 = await api.getTimeline({ limit: 3, cursor: page2.nextCursor! });
  assert.strictEqual(page3.items.length, 3);
  assert.strictEqual(page3.hasMore, true); // One left (event-9)
  assert.ok(page3.nextCursor);
  assert.strictEqual(page3.items[0].eventId, 'event-6');
  assert.strictEqual(page3.items[2].eventId, 'event-8');
  console.log('✅ Page 3 passed');

  // 4. Final Page (using cursor from page 3, limit 3)
  const page4 = await api.getTimeline({ limit: 3, cursor: page3.nextCursor! });
  assert.strictEqual(page4.items.length, 1);
  assert.strictEqual(page4.hasMore, false);
  assert.strictEqual(page4.nextCursor, null);
  assert.strictEqual(page4.items[0].eventId, 'event-9');
  console.log('✅ Final Page passed');

  // 5. Determinism test
  const page1_again = await api.getTimeline({ limit: 3 });
  assert.deepStrictEqual(page1.items, page1_again.items, 'Pagination must be deterministic');
  assert.strictEqual(page1.nextCursor, page1_again.nextCursor);
  console.log('✅ Determinism passed');

  // 6. Agent Registry Pagination
  const agentsPage1 = await api.getAgents({ limit: 2 });
  assert.strictEqual(agentsPage1.items.length, 2);
  assert.strictEqual(agentsPage1.hasMore, true);
  assert.ok(agentsPage1.nextCursor);

  const agentsPage2 = await api.getAgents({ limit: 2, cursor: agentsPage1.nextCursor! });
  assert.strictEqual(agentsPage2.items.length, 2);
  assert.notDeepStrictEqual(agentsPage1.items, agentsPage2.items);
  console.log('✅ Agent Registry Pagination passed');

  // 7. Security: Forbidden fields in cursor
  const cursor = page1.nextCursor!;
  const decoded = decodeCursorV1(cursor);
  assert.ok(decoded);
  const forbiddenFields = ['tenantId', 'actorId', 'requestId', 'idempotencyKey', 'payload'];
  forbiddenFields.forEach(field => {
    assert.strictEqual((decoded as any)[field], undefined, `Cursor must NOT contain ${field}`);
  });
  console.log('✅ Security (forbidden fields in cursor) passed');

  console.log('All Pagination tests passed! 🚀');
}

testPagination().catch(err => {
  console.error('❌ Pagination tests failed:');
  console.error(err);
  process.exit(1);
});
