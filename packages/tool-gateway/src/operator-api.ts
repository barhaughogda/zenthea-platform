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
import { ControlPlaneContext } from '@starter/service-control-adapter';
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
  PolicyDtoV2,
  ViewDto, 
  ViewDtoV2,
  ExecutionResultDto, 
  ExecutionResultDtoV2,
  OperatorDtoVersion 
} from './operator-dtos';
import { VersionResolver } from './versioning/resolvers';
import { VersionId } from './versioning/types';
import { IDecisionHook, NoOpDecisionHook } from './decision-hooks/types';
import { MutationRequestDtoV1, MutationResultDtoV1 } from './mutation-dtos';
import { ToolExecutionCommand } from './types';
import { ToolExecutionGateway } from './gateway';

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
  private readonly VERSION_V2: OperatorDtoVersion = 'v2';

  constructor(
    private readonly timelineReader: IGovernanceTimelineReader,
    private readonly registryReader: IAgentRegistryReader,
    private readonly joiner: TimelineRegistryJoiner,
    private readonly auditEmitter: IOperatorAuditEmitter = new NoOpOperatorAuditEmitter(),
    private readonly decisionHook: IDecisionHook = new NoOpDecisionHook(),
    private readonly gateway?: ToolExecutionGateway
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
   * Lists all registered policies as safe DTOs (V2 with content versioning).
   */
  listPoliciesV2(): PolicyDtoV2[] {
    return Object.values(POLICY_REGISTRY).map(policy => ({
      version: this.VERSION_V2 as 'v2',
      policyId: policy.policyId,
      contentVersion: policy.version,
      isLatest: !!policy.isLatest,
      supersedesVersion: policy.supersedesVersion,
      deprecatedAt: policy.deprecatedAt,
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
   * Lists all registered views as safe DTOs (V2 with content versioning).
   */
  listViewsV2(): ViewDtoV2[] {
    return Object.values(SAVED_VIEW_REGISTRY).map(view => ({
      version: this.VERSION_V2 as 'v2',
      viewId: view.viewId,
      contentVersion: view.version,
      isLatest: !!view.isLatest,
      supersedesVersion: view.supersedesVersion,
      deprecatedAt: view.deprecatedAt,
      name: view.name,
      description: view.description,
      policyId: view.policyId,
      presentation: view.presentation,
    }));
  }

  /**
   * Executes a registered Operator Query Policy.
   * Returns a safe ExecutionResultDto.
   * Internal: Supports explicit versioning.
   */
  async executePolicy(policyId: string, cursor?: string, version?: VersionId): Promise<ExecutionResultDto> {
    const timestamp = new Date().toISOString();
    const executionId = crypto.randomUUID();

    try {
      // CP-18: Use Resolver for deterministic lookups
      const policy = VersionResolver.resolvePolicy(policyId, version);

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
        policyVersion: policy.version, // CP-18
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
   * Internal: Supports explicit versioning.
   */
  async executeView(viewId: string, cursor?: string, version?: VersionId): Promise<ExecutionResultDto> {
    const timestamp = new Date().toISOString();
    const executionId = crypto.randomUUID();

    try {
      // CP-18: Use Resolver for deterministic lookups
      const view = VersionResolver.resolveView(viewId, version);

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
          viewVersion: view.version, // CP-18
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
        viewVersion: view.version, // CP-18
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
   * Executes a registered Operator Query Policy (v2).
   * Includes decision hook evaluation and content versioning.
   */
  async executePolicyV2(arg: string | { policyId: string; version?: string; cursor?: string }, cursorArg?: string): Promise<ExecutionResultDtoV2> {
    const policyId = typeof arg === 'string' ? arg : arg.policyId;
    const version = typeof arg === 'string' ? undefined : arg.version;
    const cursor = typeof arg === 'string' ? cursorArg : arg.cursor;

    const v1Result = await this.executePolicy(policyId, cursor, version);
    
    let policy: any;
    try {
      policy = VersionResolver.resolvePolicy(policyId, version);
    } catch {
      // Fallback for unknown policies to allow decision hooks to evaluate the error
      policy = undefined;
    }

    const decisionResult = await this.decisionHook.evaluate({
      policyId,
      action: 'POLICY_EXECUTE',
      outcome: v1Result.outcome,
      riskTier: policy?.riskTier ?? 'low',
      category: policy?.category ?? 'Unknown',
      reasonCode: v1Result.reasonCode,
      count: v1Result.resultSummary.count,
    });

    return {
      ...v1Result,
      version: 'v2',
      resolvedVersion: policy?.version, // CP-18
      decision: decisionResult.requirement === 'required' ? {
        kind: decisionResult.decisionKind!,
        severity: decisionResult.severity!,
        reasonCode: decisionResult.reasonCode!,
        message: decisionResult.message,
      } : undefined,
    };
  }

  /**
   * Executes a Saved View (v2).
   * Includes decision hook evaluation and content versioning.
   */
  async executeViewV2(arg: string | { viewId: string; version?: string; cursor?: string }, cursorArg?: string): Promise<ExecutionResultDtoV2> {
    const viewId = typeof arg === 'string' ? arg : arg.viewId;
    const version = typeof arg === 'string' ? undefined : arg.version;
    const cursor = typeof arg === 'string' ? cursorArg : arg.cursor;

    const v1Result = await this.executeView(viewId, cursor, version);
    
    let view: any;
    let policy: any;
    try {
      view = VersionResolver.resolveView(viewId, version);
      policy = view ? POLICY_REGISTRY[view.policyId] : undefined;
    } catch {
      view = undefined;
      policy = undefined;
    }

    const decisionResult = await this.decisionHook.evaluate({
      policyId: view?.policyId ?? 'Unknown',
      viewId,
      action: 'VIEW_EXECUTE',
      outcome: v1Result.outcome,
      riskTier: policy?.riskTier ?? 'low',
      category: policy?.category ?? 'Unknown',
      reasonCode: v1Result.reasonCode,
      count: v1Result.resultSummary.count,
    });

    return {
      ...v1Result,
      version: 'v2',
      resolvedVersion: view?.version, // CP-18
      decision: decisionResult.requirement === 'required' ? {
        kind: decisionResult.decisionKind!,
        severity: decisionResult.severity!,
        reasonCode: decisionResult.reasonCode!,
        message: decisionResult.message,
      } : undefined,
    };
  }

  /**
   * Headless Mutation Endpoint (CP-17).
   * Executes a mutation and returns a metadata-only result DTO.
   * CP-21: Requires explicit ControlPlaneContext.
   * 🚫 NO sensitive fields in output.
   */
  async executeMutationV1(command: ToolExecutionCommand, ctx: ControlPlaneContext): Promise<MutationResultDtoV1> {
    if (!this.gateway) {
      throw new Error('Operator Error: Gateway not configured for mutations');
    }

    const result = await this.gateway.execute(command, ctx);
    
    return {
      executionId: result.executionId,
      status: result.status,
      toolName: command.tool.name,
      toolVersion: command.tool.version,
      timestamp: result.timestamp,
      reasonCode: result.error?.code,
      summary: result.data?.summary, // Safe summary from mock executor
    };
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
