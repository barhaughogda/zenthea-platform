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

/**
 * Versioned API Response Contracts (v1)
 */

export interface OperatorTimelineResponseV1 {
  version: 'v1';
  events: GovernanceTimelineEvent[];
  count: number;
}

export interface OperatorAgentRegistryResponseV1 {
  version: 'v1';
  agents: AgentRegistryEntry[];
  count: number;
}

export interface OperatorEnrichedTimelineResponseV1 {
  version: 'v1';
  entries: EnrichedTimelineEntry[];
  count: number;
}

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
    const events = await this.timelineReader.query(filter);
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    
    return {
      version: 'v1',
      events: sortedEvents,
      count: sortedEvents.length,
    };
  }

  /**
   * Exposes the Agent Registry.
   * Deterministic, stable ordering (by agentId and version).
   */
  async getAgents(): Promise<OperatorAgentRegistryResponseV1> {
    const agents = this.registryReader.listAgents();
    
    return {
      version: 'v1',
      agents,
      count: agents.length,
    };
  }

  /**
   * Exposes the enriched Registry + Timeline join.
   * Deterministic, stable ordering (chronological).
   */
  async getEnrichedTimeline(filter: TimelineFilter): Promise<OperatorEnrichedTimelineResponseV1> {
    const events = await this.timelineReader.query(filter);
    const sortedEvents = TimelineAggregator.sortChronologically(events);
    const enrichedEntries = this.joiner.join(sortedEvents);
    
    return {
      version: 'v1',
      entries: enrichedEntries,
      count: enrichedEntries.length,
    };
  }
}
