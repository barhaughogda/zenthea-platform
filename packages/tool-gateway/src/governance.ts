import * as crypto from 'crypto';
import { AgentType, GovernanceReasonCode, GovernancePolicySnapshot } from './types';

export type ToolScope = 
  | 'consent.read' 
  | 'consent.write' 
  | 'chat.read' 
  | 'chat.write' 
  | 'appointment.read' 
  | 'appointment.write' 
  | 'medical_advisor.read';

/**
 * Mapping of tool names to their required scopes.
 * If a tool is not in this mapping, it is denied by default.
 */
export const TOOL_SCOPE_MAPPING: Record<string, ToolScope> = {
  'createConsent': 'consent.write',
  'revokeConsent': 'consent.write',
  'updateConsentPreferences': 'consent.write',
  'getConsent': 'consent.read',
  'chat.createConversation': 'chat.write',
  'chat.sendMessage': 'chat.write',
  'chat.getHistory': 'chat.read',
  'appointment.requestAppointment': 'appointment.write',
  'appointment.cancelAppointment': 'appointment.write',
  'appointment.listAvailableSlots': 'appointment.read',
  'medical_advisor.getAdvice': 'medical_advisor.read',
};

interface AgentDeclaration {
  type: AgentType;
  allowedScopes: ToolScope[];
}

/**
 * Registry of known agents and their permitted scopes.
 */
export const AGENT_REGISTRY: Record<string, AgentDeclaration> = {
  'patient-portal-agent': {
    type: 'patient-facing',
    allowedScopes: [
      'consent.read', 
      'consent.write', 
      'chat.read', 
      'chat.write', 
      'appointment.read', 
      'appointment.write', 
      'medical_advisor.read'
    ],
  },
  'consent-agent': {
    type: 'clinical',
    allowedScopes: ['consent.read', 'consent.write'],
  },
  'chat-agent': {
    type: 'clinical',
    allowedScopes: ['chat.read', 'chat.write'],
  },
  'appointment-booking-agent': {
    type: 'clinical',
    allowedScopes: ['appointment.read', 'appointment.write'],
  },
};

export interface PolicyEvaluation {
  allowed: boolean;
  reasonCode?: GovernanceReasonCode;
  agentType: AgentType;
}

/**
 * Evaluates whether an agent is permitted to execute a specific tool.
 */
export class PolicyEvaluator {
  evaluate(agentId: string, toolName: string): PolicyEvaluation {
    const agent = AGENT_REGISTRY[agentId];

    // 1. Check if agent is registered
    if (!agent) {
      return {
        allowed: false,
        reasonCode: 'UNKNOWN_AGENT',
        agentType: 'unknown',
      };
    }

    // 2. Check if tool has a scope mapping
    const requiredScope = TOOL_SCOPE_MAPPING[toolName];
    if (!requiredScope) {
      return {
        allowed: false,
        reasonCode: 'UNKNOWN_TOOL',
        agentType: agent.type,
      };
    }

    // 3. Check if agent has the required scope
    if (!agent.allowedScopes.includes(requiredScope)) {
      return {
        allowed: false,
        reasonCode: 'SCOPE_DENIED',
        agentType: agent.type,
      };
    }

    return {
      allowed: true,
      agentType: agent.type,
    };
  }
}

/**
 * Normalizes and deep-sorts an object for deterministic hashing.
 */
function normalizeForHash(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    // For arrays, we sort them to ensure order independence
    return obj.map(normalizeForHash).sort((a, b) => {
      const sA = JSON.stringify(a);
      const sB = JSON.stringify(b);
      return sA.localeCompare(sB);
    });
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: any = {};
  for (const key of sortedKeys) {
    result[key] = normalizeForHash(obj[key]);
  }
  return result;
}

/**
 * Generates a metadata-only snapshot of the current governance policy.
 * 🚫 STRICTLY NO PHI or sensitive identifiers.
 */
export function generatePolicySnapshot(version: string = '1.0.0'): GovernancePolicySnapshot {
  const policy = {
    agentRegistry: AGENT_REGISTRY,
    toolScopeMapping: TOOL_SCOPE_MAPPING,
  };

  const normalized = normalizeForHash(policy);
  const serialized = JSON.stringify(normalized);
  const hash = crypto.createHash('sha256').update(serialized).digest('hex');

  return {
    snapshotId: crypto.randomUUID(),
    policyVersion: version,
    policyHash: hash,
    agentCount: Object.keys(AGENT_REGISTRY).length,
    toolCount: Object.keys(TOOL_SCOPE_MAPPING).length,
    generatedAt: new Date().toISOString(),
  };
}
