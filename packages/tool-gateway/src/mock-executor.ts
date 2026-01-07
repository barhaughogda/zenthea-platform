import { ToolExecutionCommand, ToolExecutionResult } from './types';

/**
 * Deterministic Mock Executor for CP-17 (Communication Tools Only).
 */
export class MockMutationExecutor {
  async execute(command: ToolExecutionCommand): Promise<ToolExecutionResult> {
    const { name, version } = command.tool;
    const timestamp = new Date().toISOString();
    const executionId = `exec-${Math.random().toString(36).substring(2, 11)}`;

    if (name === 'comm.send_message') {
      return {
        executionId,
        commandId: command.commandId,
        status: 'success',
        data: {
          messageDispatched: true,
          summary: `Message sent to ${command.parameters.recipientId} via ${command.parameters.channel}`,
        },
        timestamp,
      };
    }

    if (name === 'comm.create_notification') {
      return {
        executionId,
        commandId: command.commandId,
        status: 'success',
        data: {
          notificationCreated: true,
          summary: `Notification created for user ${command.parameters.userId}: ${command.parameters.title}`,
        },
        timestamp,
      };
    }

    return {
      executionId,
      commandId: command.commandId,
      status: 'failure',
      error: {
        code: 'UNSUPPORTED_MOCK_TOOL',
        message: `Mock executor does not support tool: ${name}`,
        retryable: false,
      },
      timestamp,
    };
  }
}
