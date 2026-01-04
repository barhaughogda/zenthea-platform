import { AsyncLocalStorage } from 'node:async_hooks';
import { v4 as uuidv4 } from 'uuid';

export interface ObservabilityContext {
  correlationId: string;
  tenantId?: string;
  userId?: string;
  serviceName: string;
  environment: string;
}

const contextStorage = new AsyncLocalStorage<ObservabilityContext>();

export const getContext = (): ObservabilityContext | undefined => {
  return contextStorage.getStore();
};

export const runWithContext = <T>(context: Partial<ObservabilityContext>, fn: () => T): T => {
  const parentContext = getContext();
  const fullContext: ObservabilityContext = {
    correlationId: context.correlationId || parentContext?.correlationId || uuidv4(),
    tenantId: context.tenantId || parentContext?.tenantId,
    userId: context.userId || parentContext?.userId,
    serviceName: context.serviceName || parentContext?.serviceName || 'unknown-service',
    environment: context.environment || parentContext?.environment || process.env.NODE_ENV || 'development',
  };

  return contextStorage.run(fullContext, fn);
};

export const getCorrelationId = (): string => {
  return getContext()?.correlationId || 'no-correlation-id';
};
