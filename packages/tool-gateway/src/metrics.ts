import { metrics as baseMetrics } from '@starter/observability';
import { ToolGatewayEvent } from './types';

/**
 * Tool Gateway Metrics
 * 
 * Provides structured counters and histograms for tool execution outcomes.
 * ENFORCES Cardinality Rules: No PHI, no tenantId, no actorId, no requestId.
 * 
 * Reliability: Metrics emission MUST NOT throw and must not affect control flow.
 */
export const toolGatewayMetrics = {
  /**
   * Records the total number of requests received by the gateway.
   * Labels: toolName, decision, actorType
   */
  recordRequest(params: {
    toolName: string;
    decision: ToolGatewayEvent['decision'];
    actorType: ToolGatewayEvent['actorType'];
  }) {
    try {
      baseMetrics.increment('tool_gateway_requests_total', 1, {
        toolName: params.toolName,
        decision: params.decision,
        actorType: params.actorType,
      });
    } catch (err) {
      // Failures must be swallowed safely
      // We use console.error only if we want to know about it during development
      // but the requirement says "Failures must be swallowed safely".
    }
  },

  /**
   * Records errors encountered during tool execution.
   * Labels: toolName, errorCode
   */
  recordError(params: {
    toolName: string;
    errorCode: string;
  }) {
    try {
      baseMetrics.increment('tool_gateway_errors_total', 1, {
        toolName: params.toolName,
        errorCode: params.errorCode,
      });
    } catch (err) {
      // Swallowed safely
    }
  },

  /**
   * Records rate limiting events.
   * Labels: toolName, actorType
   */
  recordRateLimited(params: {
    toolName: string;
    actorType: ToolGatewayEvent['actorType'];
  }) {
    try {
      baseMetrics.increment('tool_gateway_rate_limited_total', 1, {
        toolName: params.toolName,
        actorType: params.actorType,
      });
    } catch (err) {
      // Swallowed safely
    }
  },

  /**
   * Records the latency of tool execution in milliseconds.
   * Labels: toolName, decision
   */
  recordLatency(params: {
    toolName: string;
    decision: ToolGatewayEvent['decision'];
    latencyMs: number;
  }) {
    try {
      // Using 'timing' from baseMetrics as specified for histograms
      baseMetrics.timing('tool_gateway_latency_ms', params.latencyMs, {
        toolName: params.toolName,
        decision: params.decision,
      });
    } catch (err) {
      // Swallowed safely
    }
  }
};
