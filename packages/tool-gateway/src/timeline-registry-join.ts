import { GovernanceTimelineEvent } from './timeline';
import { AgentRegistryEntry, IAgentRegistryReader } from './agent-registry';

/**
 * Enriched view of a timeline event joined with agent registry metadata.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, requestId, or payloads.
 */
export interface EnrichedTimelineEntry {
  timelineEvent: GovernanceTimelineEvent;
  agent: {
    agentId: string;
    agentVersion: string;
    agentType: string;
    lifecycleState: string;
    allowedScopes: string[];
  } | 'unknown';
  policySnapshotHash: string;
  timestamp: string;
}

/**
 * Joiner service for Registry + Timeline data.
 * Produces deterministic, read-only views.
 */
export class TimelineRegistryJoiner {
  constructor(private readonly registryReader: IAgentRegistryReader) {}

  /**
   * Joins a list of timeline events with the agent registry.
   * Join criteria: agentVersion AND policySnapshotHash.
   */
  join(events: GovernanceTimelineEvent[]): EnrichedTimelineEntry[] {
    const registry = this.registryReader.listAgents();

    // Create a map for efficient lookups: version|hash -> AgentRegistryEntry
    // Note: Join is strictly on agentVersion and policySnapshotHash.
    // Deterministic: if multiple agents share version|hash, the last one 
    // in sorted registry order (by agentId) wins.
    const lookup = new Map<string, AgentRegistryEntry>();
    for (const entry of registry) {
      const key = this.getJoinKey(entry.agentVersion, entry.policySnapshotHash);
      lookup.set(key, entry);
    }

    return events.map(event => {
      const key = this.getJoinKey(event.agentVersion, event.policySnapshotHash);
      const agentEntry = lookup.get(key);

      return {
        timelineEvent: event,
        agent: agentEntry ? {
          agentId: agentEntry.agentId,
          agentVersion: agentEntry.agentVersion,
          agentType: agentEntry.agentType,
          lifecycleState: agentEntry.lifecycleState,
          allowedScopes: [...agentEntry.allowedScopes],
        } : 'unknown',
        policySnapshotHash: event.policySnapshotHash,
        timestamp: event.timestamp,
      };
    });
  }

  private getJoinKey(version: string, hash: string): string {
    return `${version}|${hash}`;
  }
}
