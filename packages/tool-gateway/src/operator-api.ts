import { 
  GovernanceTimelineEvent, 
  TimelineFilter, 
  IGovernanceTimelineReader,
  TimelineAggregator
} from './timeline';
import { 
  AgentRegistryEntry, 
  IAgentRegistryReader 
} from './agent-registry';
import { 
  EnrichedTimelineEntry, 
  TimelineRegistryJoiner 
} from './timeline-registry-join';
import { 
  PaginatedResponseV1, 
  encodeCursorV1, 
  decodeCursorV1 
} from './cursor';

/**
 * Versioned API Response Contracts (v1)
 */

export interface OperatorTimelineResponseV1 extends PaginatedResponseV1<GovernanceTimelineEvent> {}

export interface OperatorAgentRegistryResponseV1 extends PaginatedResponseV1<AgentRegistryEntry> {}

export interface OperatorEnrichedTimelineResponseV1 extends PaginatedResponseV1<EnrichedTimelineEntry> {}

/**
 * Operator-facing APIs (Read-Only).
 * ⚠️ SECURITY: NO tenantId, actorId, requestId, or payloads.
 * Metadata only. Deterministic. Stable ordering.
 */
export class OperatorAPI {
  constructor(
    private readonly timelineReader: IGovernanceTimelineReader,
    private readonly registryReader: IAgentRegistryReader,
    private readonly joiner: TimelineRegistryJoiner
  ) {}

  /**
   * Exposes the Governance Timeline.
   * Deterministic, stable ordering (chronological).
   */
  async getTimeline(filter: TimelineFilter): Promise<OperatorTimelineResponseV1> {
    const limit = filter.limit ?? 50;
    
    // Fetch limit + 1 to detect if there's more
    const events = await this.timelineReader.query({ 
      ...filter, 
      limit: limit + 1 
    });
    
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    
    // Handle cursor slicing if the reader didn't (generic implementation)
    let startIndex = 0;
    if (filter.cursor) {
      const decoded = decodeCursorV1(filter.cursor);
      if (decoded) {
        // Find first item AFTER the cursor by timestamp + eventId
        startIndex = sortedEvents.findIndex(e => 
          e.timestamp === decoded.timestamp && e.eventId === decoded.secondaryKey
        ) + 1;
      }
    }

    const slicedItems = sortedEvents.slice(startIndex, startIndex + limit);
    const hasMore = sortedEvents.length > (startIndex + limit);
    
    let nextCursor: string | null = null;
    if (hasMore && slicedItems.length > 0) {
      const lastItem = slicedItems[slicedItems.length - 1];
      nextCursor = encodeCursorV1({
        timestamp: lastItem.timestamp,
        secondaryKey: lastItem.eventId
      });
    }

    return {
      version: 'v1',
      items: slicedItems,
      nextCursor,
      hasMore,
      count: slicedItems.length,
    };
  }

  /**
   * Exposes the Agent Registry.
   * Deterministic, stable ordering (by agentId and version).
   */
  async getAgents(limit: number = 50, cursor?: string): Promise<OperatorAgentRegistryResponseV1> {
    // Fetch limit + 1 to detect if there's more
    const agents = this.registryReader.listAgents(limit + 1, cursor);
    
    const hasMore = agents.length > limit;
    const items = agents.slice(0, limit);
    
    let nextCursor: string | null = null;
    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursorV1({
        timestamp: lastItem.lastUpdatedAt,
        secondaryKey: `${lastItem.agentId}:${lastItem.agentVersion}`
      });
    }

    return {
      version: 'v1',
      items,
      nextCursor,
      hasMore,
      count: items.length,
    };
  }

  /**
   * Exposes the enriched Registry + Timeline join.
   * Deterministic, stable ordering (chronological).
   */
  async getEnrichedTimeline(filter: TimelineFilter): Promise<OperatorEnrichedTimelineResponseV1> {
    const limit = filter.limit ?? 50;
    
    // Fetch limit + 1
    const events = await this.timelineReader.query({ 
      ...filter, 
      limit: limit + 1 
    });
    
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    
    // Handle cursor slicing
    let startIndex = 0;
    if (filter.cursor) {
      const decoded = decodeCursorV1(filter.cursor);
      if (decoded) {
        startIndex = sortedEvents.findIndex(e => 
          e.timestamp === decoded.timestamp && e.eventId === decoded.secondaryKey
        ) + 1;
      }
    }

    const slicedEvents = sortedEvents.slice(startIndex, startIndex + limit);
    const enrichedEntries = this.joiner.join(slicedEvents);
    const hasMore = sortedEvents.length > (startIndex + limit);
    
    let nextCursor: string | null = null;
    if (hasMore && slicedEvents.length > 0) {
      const lastItem = slicedEvents[slicedEvents.length - 1];
      nextCursor = encodeCursorV1({
        timestamp: lastItem.timestamp,
        secondaryKey: lastItem.eventId
      });
    }

    return {
      version: 'v1',
      items: enrichedEntries,
      nextCursor,
      hasMore,
      count: enrichedEntries.length,
    };
  }
}
