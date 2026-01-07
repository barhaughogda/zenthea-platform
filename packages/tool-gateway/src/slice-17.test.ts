import { ToolExecutionGateway } from './gateway';
import { IToolAuditLogger, ToolAuditLog, ToolExecutionCommand } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Mock Audit Logger to capture events for verification.
 */
class MockAuditLogger implements IToolAuditLogger {
  public events: ToolAuditLog[] = [];
  async log(event: ToolAuditLog): Promise<void> {
    this.events.push(event);
  }
}

describe('CP-17: Controlled Mutations (Slice 17)', async () => {
  let auditLogger: MockAuditLogger;
  let gateway: ToolExecutionGateway;

  const setup = () => {
    auditLogger = new MockAuditLogger();
    gateway = new ToolExecutionGateway(auditLogger);
  };

  const getBaseCommand = (): ToolExecutionCommand => ({
    commandId: uuidv4(),
    proposalId: uuidv4(),
    tenantId: 'tenant-1',
    agentId: 'patient-portal-agent',
    agentVersion: '1.0.0',
    tool: { name: 'comm.send_message', version: 'v1' },
    parameters: {
      recipientId: uuidv4(),
      content: 'Hello World',
      channel: 'email',
    },
    approval: {
      approvedBy: 'human-1',
      approvedAt: new Date().toISOString(),
      approvalType: 'human',
    },
    idempotencyKey: 'key-1',
    metadata: { correlationId: 'corr-1' },
  });

  await it('should allow a valid mutation tool (comm.send_message)', async () => {
    setup();
    const baseCommand = getBaseCommand();
    const result = await gateway.execute(baseCommand);
    expect(result.status).toBe('success');
    expect(result.data?.messageDispatched).toBe(true);
    
    // Verify audit trail
    const actions = auditLogger.events.map(e => e.action);
    expect(actions).toContain('command_received');
    expect(actions).toContain('command_dispatched');
    expect(actions).toContain('command_succeeded');
  });

  await it('should allow a valid mutation tool (comm.create_notification)', async () => {
    setup();
    const command = {
      ...getBaseCommand(),
      commandId: uuidv4(),
      tool: { name: 'comm.create_notification', version: 'v1' },
      parameters: {
        userId: uuidv4(),
        title: 'Test',
        body: 'Test Body',
      },
      idempotencyKey: 'key-notify',
    };

    const result = await gateway.execute(command);
    expect(result.status).toBe('success');
    expect(result.data?.notificationCreated).toBe(true);
  });

  await it('should reject unknown tool by default (fail closed)', async () => {
    setup();
    const command = {
      ...getBaseCommand(),
      commandId: uuidv4(),
      tool: { name: 'unknown.tool', version: 'v1' },
    };

    const result = await gateway.execute(command);
    expect(result.status).toBe('failure');
    expect(result.error?.code).toBe('UNKNOWN_TOOL');
  });

  await it('should reject unknown version', async () => {
    setup();
    const command = {
      ...getBaseCommand(),
      commandId: uuidv4(),
      tool: { name: 'comm.send_message', version: 'v99' },
    };

    const result = await gateway.execute(command);
    expect(result.status).toBe('failure');
    expect(result.error?.code).toBe('UNKNOWN_VERSION');
  });

  await it('should reject invalid parameters (schema validation)', async () => {
    setup();
    const command = {
      ...getBaseCommand(),
      commandId: uuidv4(),
      parameters: {
        recipientId: 'not-a-uuid', // Should fail UUID check
        content: '', // Should fail min(1) check
      },
    };

    const result = await gateway.execute(command);
    expect(result.status).toBe('failure');
    expect(result.error?.code).toBe('INVALID_PARAMS');
  });

  await it('should reject mutation without approval', async () => {
    setup();
    const command = {
      ...getBaseCommand(),
      commandId: uuidv4(),
      approval: undefined as any,
    };

    const result = await gateway.execute(command);
    expect(result.status).toBe('failure');
    // Error will come from validateExecutionCommand or our manual check
    expect(result.error?.code).toBe('VALIDATION_FAILED'); 
  });

  await it('should enforce idempotency: same key returns prior result', async () => {
    setup();
    const baseCommand = getBaseCommand();
    const result1 = await gateway.execute(baseCommand);
    const result2 = await gateway.execute({ ...baseCommand, commandId: uuidv4() });

    expect(result1.executionId).toBe(result2.executionId);
    expect(result1.timestamp).toBe(result2.timestamp);
    
    // Verify no double dispatch in audit
    const dispatchEvents = auditLogger.events.filter(e => e.action === 'command_dispatched');
    expect(dispatchEvents.length).toBe(1);
  });

  await it('should reject idempotency collision (same key, different params)', async () => {
    setup();
    const baseCommand = getBaseCommand();
    await gateway.execute(baseCommand);

    const command2 = {
      ...baseCommand,
      commandId: uuidv4(),
      parameters: {
        ...baseCommand.parameters,
        content: 'Different Content',
      },
    };

    const result = await gateway.execute(command2);
    expect(result.status).toBe('failure');
    expect(result.error?.code).toBe('IDEMPOTENCY_COLLISION');
  });

  await it('should maintain audit safety: no sensitive leakage in mutation audit', async () => {
    setup();
    const baseCommand = getBaseCommand();
    await gateway.execute(baseCommand);

    const receivedEvent = auditLogger.events.find(e => e.action === 'command_received');
    expect(receivedEvent?.payload).toBeUndefined(); // Parameters must be omitted
    expect(receivedEvent?.tenantId).toBeDefined(); // Internal audit store can have tenantId
  });
});

/**
 * Minimal expect/describe/it implementation since we're using tsx and not a full test runner.
 */
async function describe(name: string, fn: () => Promise<void>) {
  console.log(`\nTest Suite: ${name}`);
  await fn();
}

async function it(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
  } catch (err) {
    console.error(`  ❌ ${name}`);
    console.error(err);
    process.exit(1);
  }
}

function expect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toContain: (expected: any) => {
      if (!Array.isArray(actual) || !actual.includes(expected)) {
        throw new Error(`Expected array to contain ${expected}`);
      }
    },
    toBeDefined: () => {
      if (actual === undefined || actual === null) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toBeUndefined: () => {
      if (actual !== undefined) {
        throw new Error(`Expected value to be undefined, but got ${JSON.stringify(actual)}`);
      }
    }
  };
}
