import { 
  GovernanceTimelineEvent, 
  TimelineFilter, 
  IGovernanceTimelineReader,
  TimelineAggregator
} from './timeline';
import { 
  AgentRegistryEntry, 
  IAgentRegistryReader,
  AgentRegistryFilter 
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
import { z } from 'zod';

/**
 * Filter Validation Schemas (Strict Allowlist)
 */

export const TimelineFilterSchema = z.object({
  policySnapshotHash: z.string().optional(),
  agentVersion: z.string().optional(),
  toolName: z.string().optional(),
  decision: z.enum(['allowed', 'denied', 'warning', 'rate_limited', 'error']).optional(),
  actorType: z.enum(['patient', 'provider', 'system', 'unknown']).optional(),
  fromTimestamp: z.string().datetime().optional(),
  toTimestamp: z.string().datetime().optional(),
  type: z.enum(['TOOL_GATEWAY', 'GOVERNANCE_CONTROL', 'APPROVAL_SIGNAL', 'LIFECYCLE_TRANSITION']).optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
}).strict();

export const AgentRegistryFilterSchema = z.object({
  agentType: z.enum(['patient-facing', 'clinical', 'platform', 'unknown']).optional(),
  lifecycleState: z.enum(['active', 'deprecated', 'disabled', 'experimental', 'retired']).optional(),
  agentId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
}).strict();

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
    const validatedFilter = TimelineFilterSchema.parse(filter);
    const limit = validatedFilter.limit ?? 50;
    
    // Fetch limit + 1 to detect if there's more
    const events = await this.timelineReader.query({ 
      ...validatedFilter, 
      limit: limit + 1 
    });
    
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    
    // Handle cursor slicing if the reader didn't (generic implementation)
    let startIndex = 0;
    if (validatedFilter.cursor) {
      const decoded = decodeCursorV1(validatedFilter.cursor);
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
  async getAgents(filter: AgentRegistryFilter = {}): Promise<OperatorAgentRegistryResponseV1> {
    const validatedFilter = AgentRegistryFilterSchema.parse(filter);
    const limit = validatedFilter.limit ?? 50;

    // Fetch limit + 1 to detect if there's more
    const agents = this.registryReader.listAgents({
      ...validatedFilter,
      limit: limit + 1
    });
    
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
    const validatedFilter = TimelineFilterSchema.parse(filter);
    const limit = validatedFilter.limit ?? 50;
    
    // Fetch limit + 1
    const events = await this.timelineReader.query({ 
      ...validatedFilter, 
      limit: limit + 1 
    });
    
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    
    // Handle cursor slicing
    let startIndex = 0;
    if (validatedFilter.cursor) {
      const decoded = decodeCursorV1(validatedFilter.cursor);
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
