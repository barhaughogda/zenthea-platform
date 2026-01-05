import * as crypto from 'crypto';
import { 
  AgentType, 
  GovernanceReasonCode, 
  GovernancePolicySnapshot, 
  AgentLifecycleState, 
  AgentVersion,
  PolicyEvaluation
} from './types';

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

interface AgentVersionDeclaration {
  version: AgentVersion;
  lifecycleState: AgentLifecycleState;
  allowedScopes: ToolScope[];
}

interface AgentDeclaration {
  type: AgentType;
  versions: Record<AgentVersion, AgentVersionDeclaration>;
}

/**
 * Registry of known agents and their permitted scopes, versioned with lifecycle states.
 */
export const AGENT_REGISTRY: Record<string, AgentDeclaration> = {
  'patient-portal-agent': {
    type: 'patient-facing',
    versions: {
      '1.0.0': {
        version: '1.0.0',
        lifecycleState: 'active',
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
    },
  },
  'consent-agent': {
    type: 'clinical',
    versions: {
      '1.0.0': {
        version: '1.0.0',
        lifecycleState: 'active',
        allowedScopes: ['consent.read', 'consent.write'],
      },
    },
  },
  'chat-agent': {
    type: 'clinical',
    versions: {
      '1.0.0': {
        version: '1.0.0',
        lifecycleState: 'active',
        allowedScopes: ['chat.read', 'chat.write'],
      },
    },
  },
  'appointment-booking-agent': {
    type: 'clinical',
    versions: {
      '1.0.0': {
        version: '1.0.0',
        lifecycleState: 'active',
        allowedScopes: ['appointment.read', 'appointment.write'],
      },
    },
  },
  'test-agent': {
    type: 'platform',
    versions: {
      'active-v1': {
        version: 'active-v1',
        lifecycleState: 'active',
        allowedScopes: ['chat.read'],
      },
      'deprecated-v1': {
        version: 'deprecated-v1',
        lifecycleState: 'deprecated',
        allowedScopes: ['chat.read'],
      },
      'disabled-v1': {
        version: 'disabled-v1',
        lifecycleState: 'disabled',
        allowedScopes: ['chat.read'],
      },
      'retired-v1': {
        version: 'retired-v1',
        lifecycleState: 'retired',
        allowedScopes: ['chat.read'],
      },
    },
  },
};

/**
 * Evaluates whether an agent version is permitted to execute a specific tool.
 */
export class PolicyEvaluator {
  evaluate(agentId: string, agentVersion: string, toolName: string): PolicyEvaluation {
    const agent = AGENT_REGISTRY[agentId];

    // 1. Check if agent is registered
    if (!agent) {
      return {
        allowed: false,
        reasonCode: 'UNKNOWN_AGENT',
        agentType: 'unknown',
      };
    }

    // 2. Check if agent version exists
    const versionInfo = agent.versions[agentVersion];
    if (!versionInfo) {
      return {
        allowed: false,
        reasonCode: 'UNKNOWN_AGENT_VERSION',
        agentType: agent.type,
      };
    }

    // 3. Check Lifecycle State
    if (versionInfo.lifecycleState === 'disabled' || versionInfo.lifecycleState === 'retired') {
      return {
        allowed: false,
        reasonCode: 'LIFECYCLE_DENIED',
        agentType: agent.type,
      };
    }

    let warningCode: GovernanceReasonCode | undefined;
    if (versionInfo.lifecycleState === 'deprecated') {
      warningCode = 'DEPRECATED_AGENT';
    }

    // 4. Check if tool has a scope mapping
    const requiredScope = TOOL_SCOPE_MAPPING[toolName];
    if (!requiredScope) {
      return {
        allowed: false,
        reasonCode: 'UNKNOWN_TOOL',
        agentType: agent.type,
      };
    }

    // 5. Check if agent version has the required scope
    if (!versionInfo.allowedScopes.includes(requiredScope)) {
      return {
        allowed: false,
        reasonCode: 'SCOPE_DENIED',
        agentType: agent.type,
      };
    }

    return {
      allowed: true,
      agentType: agent.type,
      warningCode,
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
