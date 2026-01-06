import { 
  AgentType, 
  AgentLifecycleState, 
  AgentVersion 
} from './types';
import { AGENT_REGISTRY, generatePolicySnapshot } from './governance';
import { decodeCursorV1, encodeCursorV1 } from './cursor';

/**
 * Metadata-only projection of an agent version.
 * 🚫 STRICTLY NO PHI, tenantId, actorId, or payloads.
 */
export interface AgentRegistryEntry {
  agentId: string;
  agentVersion: AgentVersion;
  agentType: AgentType;
  lifecycleState: AgentLifecycleState;
  allowedScopes: string[];
  policySnapshotHash: string;
  lastUpdatedAt: string;
}

/**
 * Read-only interface for exploring the agent registry.
 */
export interface IAgentRegistryReader {
  /**
   * Lists all registered agents and versions, sorted by agentId and version.
   */
  listAgents(limit?: number, cursor?: string): AgentRegistryEntry[];

  /**
   * Gets all registered versions for a specific agent.
   */
  getAgent(agentId: string): AgentRegistryEntry[];

  /**
   * Gets a specific agent version.
   */
  getAgentVersion(agentId: string, agentVersion: string): AgentRegistryEntry | undefined;
}

/**
 * Deterministic, read-only reader for the AGENT_REGISTRY.
 */
export class AgentRegistryReader implements IAgentRegistryReader {
  private readonly snapshot = generatePolicySnapshot();

  listAgents(limit: number = 50, cursor?: string): AgentRegistryEntry[] {
    const allEntries: AgentRegistryEntry[] = [];

    // Sort agent IDs for deterministic output
    const sortedAgentIds = Object.keys(AGENT_REGISTRY).sort();

    for (const agentId of sortedAgentIds) {
      const agent = AGENT_REGISTRY[agentId];
      
      // Sort versions for deterministic output
      const sortedVersions = Object.keys(agent.versions).sort();

      for (const version of sortedVersions) {
        const versionInfo = agent.versions[version];
        allEntries.push(this.mapToEntry(agentId, agent.type, versionInfo));
      }
    }

    // Agent Registry ordering: agentId + agentVersion
    // Since we built the list using sorted keys, it's already in the correct order.

    let startIndex = 0;
    if (cursor) {
      const decoded = decodeCursorV1(cursor);
      if (decoded) {
        // Find the first index AFTER the cursor
        // Secondary key for registry is agentId:agentVersion
        const cursorKey = decoded.secondaryKey;
        startIndex = allEntries.findIndex(e => `${e.agentId}:${e.agentVersion}` === cursorKey) + 1;
      }
    }

    return allEntries.slice(startIndex, startIndex + limit);
  }

  getAgent(agentId: string): AgentRegistryEntry[] {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) {
      return [];
    }

    const sortedVersions = Object.keys(agent.versions).sort();
    return sortedVersions.map(version => 
      this.mapToEntry(agentId, agent.type, agent.versions[version])
    );
  }

  getAgentVersion(agentId: string, agentVersion: string): AgentRegistryEntry | undefined {
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) {
      return undefined;
    }

    const versionInfo = agent.versions[agentVersion];
    if (!versionInfo) {
      return undefined;
    }

    return this.mapToEntry(agentId, agent.type, versionInfo);
  }

  /**
   * Projects internal agent declaration to external metadata entry.
   * Ensures no forbidden fields are leaked.
   */
  private mapToEntry(
    agentId: string, 
    agentType: AgentType, 
    versionInfo: any
  ): AgentRegistryEntry {
    return {
      agentId,
      agentVersion: versionInfo.version,
      agentType,
      lifecycleState: versionInfo.lifecycleState,
      allowedScopes: [...versionInfo.allowedScopes].sort(),
      policySnapshotHash: this.snapshot.policyHash,
      lastUpdatedAt: this.snapshot.generatedAt,
    };
  }
}
