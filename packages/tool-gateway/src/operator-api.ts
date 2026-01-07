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
import { 
  POLICY_REGISTRY
} from './policy-registry';
import { SAVED_VIEW_REGISTRY } from './saved-view-registry';
import { z } from 'zod';
import { IOperatorAuditEmitter } from './types';
import { NoOpOperatorAuditEmitter } from './audit';
import * as crypto from 'crypto';
import { 
  PolicyDto, 
  ViewDto, 
  ExecutionResultDto, 
  OperatorDtoVersion 
} from './operator-dtos';

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
  private readonly VERSION: OperatorDtoVersion = 'v1';

  constructor(
    private readonly timelineReader: IGovernanceTimelineReader,
    private readonly registryReader: IAgentRegistryReader,
    private readonly joiner: TimelineRegistryJoiner,
    private readonly auditEmitter: IOperatorAuditEmitter = new NoOpOperatorAuditEmitter()
  ) {}

  /**
   * Lists all registered policies as safe DTOs.
   */
  listPolicies(): PolicyDto[] {
    return Object.values(POLICY_REGISTRY).map(policy => ({
      version: this.VERSION,
      policyId: policy.policyId,
      name: policy.name,
      description: policy.description,
      category: policy.category,
      riskTier: policy.riskTier,
      presentation: policy.presentation,
      inputs: policy.inputs,
      outputs: policy.outputs,
      links: policy.links,
    }));
  }

  /**
   * Lists all registered views as safe DTOs.
   */
  listViews(): ViewDto[] {
    return Object.values(SAVED_VIEW_REGISTRY).map(view => ({
      version: this.VERSION,
      viewId: view.viewId,
      name: view.name,
      description: view.description,
      policyId: view.policyId,
      presentation: view.presentation,
    }));
  }

  /**
   * Executes a registered Operator Query Policy.
   * Returns a safe ExecutionResultDto.
   */
  async executePolicy(policyId: string, cursor?: string): Promise<ExecutionResultDto> {
    const timestamp = new Date().toISOString();
    const executionId = crypto.randomUUID();

    try {
      const policy = POLICY_REGISTRY[policyId];
      if (!policy) {
        throw new Error(`Operator Error: Unknown policyId ${policyId}`);
      }

      let result: OperatorTimelineResponseV1 | OperatorAgentRegistryResponseV1;
      
      if (policy.target === 'timeline') {
        result = await this.getTimeline({ ...policy.filters, cursor } as TimelineFilter);
      } else if (policy.target === 'agentRegistry') {
        result = await this.getAgents({ ...policy.filters, cursor } as AgentRegistryFilter);
      } else {
        throw new Error(`Operator Error: Unsupported policy target ${policy.target}`);
      }

      await this.auditEmitter.emit({
        eventId: executionId,
        timestamp,
        action: 'POLICY_EXECUTE',
        outcome: 'ALLOWED',
        policyId,
        target: policy.target as 'timeline' | 'agentRegistry',
      });

      return {
        version: this.VERSION,
        executionId,
        kind: 'policy',
        id: policyId,
        outcome: 'ALLOWED',
        resultSummary: {
          message: `Policy ${policyId} executed successfully.`,
          count: result.count,
        },
        pageInfo: {
          hasNextPage: result.hasMore,
          count: result.count,
          limit: (policy.filters as { limit?: number }).limit ?? 50,
        },
        timestamp,
      };
    } catch (err: unknown) {
      const outcome = 'ERROR';
      let reasonCode: 'UNKNOWN_POLICY_ID' | 'UNKNOWN_VIEW_ID' | 'UNSUPPORTED_TARGET' | 'VALIDATION_FAILED' | 'INTERNAL_ERROR' = 'INTERNAL_ERROR';
      
      if (err instanceof Error && err.message.includes('Operator Error:')) {
        if (err.message.includes('Unknown policyId')) {
          reasonCode = 'UNKNOWN_POLICY_ID';
        } else if (err.message.includes('Unsupported policy target')) {
          reasonCode = 'UNSUPPORTED_TARGET';
        } else {
          reasonCode = 'VALIDATION_FAILED';
        }
      }

      await this.auditEmitter.emit({
        eventId: executionId,
        timestamp,
        action: 'POLICY_EXECUTE',
        outcome: 'REJECTED',
        reasonCode,
        policyId,
      });

      return {
        version: this.VERSION,
        executionId,
        kind: 'policy',
        id: policyId,
        outcome,
        reasonCode,
        resultSummary: {
          message: err instanceof Error ? err.message : 'Unknown error during policy execution.',
          count: 0,
        },
        pageInfo: {
          hasNextPage: false,
          count: 0,
          limit: 1,
        },
        timestamp,
      };
    }
  }

  /**
   * Executes a Saved View.
   * Views must execute via the policy path (no bypass).
   */
  async executeView(viewId: string, cursor?: string): Promise<ExecutionResultDto> {
    const timestamp = new Date().toISOString();
    const executionId = crypto.randomUUID();

    try {
      const view = SAVED_VIEW_REGISTRY[viewId];
      if (!view) {
        throw new Error(`Operator Error: Unknown viewId ${viewId}`);
      }

      // Saved views execute via the policy path
      const policyResult = await this.executePolicy(view.policyId, cursor);
      
      if (policyResult.outcome === 'ERROR') {
        await this.auditEmitter.emit({
          eventId: executionId,
          timestamp,
          action: 'VIEW_EXECUTE',
          outcome: 'REJECTED',
          reasonCode: policyResult.reasonCode as 'UNKNOWN_POLICY_ID' | 'UNKNOWN_VIEW_ID' | 'UNSUPPORTED_TARGET' | 'VALIDATION_FAILED' | 'INTERNAL_ERROR',
          viewId,
          policyId: view.policyId,
        });
        return {
          ...policyResult,
          executionId,
          kind: 'view',
          id: viewId,
        };
      }

      // Emit success for view execution as well
      await this.auditEmitter.emit({
        eventId: executionId,
        timestamp,
        action: 'VIEW_EXECUTE',
        outcome: 'ALLOWED',
        viewId,
        policyId: view.policyId,
      });
      
      // Transform policy result to view result
      return {
        ...policyResult,
        executionId, // New executionId for the view execution
        kind: 'view',
        id: viewId,
      };
    } catch (err: unknown) {
      const outcome = 'ERROR';
      let reasonCode: 'UNKNOWN_POLICY_ID' | 'UNKNOWN_VIEW_ID' | 'UNSUPPORTED_TARGET' | 'VALIDATION_FAILED' | 'INTERNAL_ERROR' = 'INTERNAL_ERROR';

      if (err instanceof Error && err.message.includes('Operator Error:')) {
        if (err.message.includes('Unknown viewId')) {
          reasonCode = 'UNKNOWN_VIEW_ID';
        } else {
          reasonCode = 'VALIDATION_FAILED';
        }
      }

      await this.auditEmitter.emit({
        eventId: executionId,
        timestamp,
        action: 'VIEW_EXECUTE',
        outcome: 'REJECTED',
        reasonCode,
        viewId,
      });

      return {
        version: this.VERSION,
        executionId,
        kind: 'view',
        id: viewId,
        outcome,
        reasonCode,
        resultSummary: {
          message: err instanceof Error ? err.message : 'Unknown error during view execution.',
          count: 0,
        },
        pageInfo: {
          hasNextPage: false,
          count: 0,
          limit: 1,
        },
        timestamp,
      };
    }
  }

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
