import { getContext, runWithContext } from './context';
import { createLogger } from './logger';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('observability-tracer');

export interface Span {
  id: string;
  parentId?: string;
  name: string;
  startTime: number;
  attributes: Record<string, any>;
}

export const tracer = {
  /**
   * Start a new span and execute the function within it
   */
  async trace<T>(name: string, attributes: Record<string, any>, fn: (span: Span) => Promise<T>): Promise<T> {
    const context = getContext();
    const spanId = uuidv4();
    const startTime = Date.now();

    const span: Span = {
      id: spanId,
      name,
      startTime,
      attributes,
    };

    logger.info('span_start', `Starting span: ${name}`, {
      spanId,
      parentId: context?.correlationId, // Simplified: use correlationId as root span for now
      ...attributes,
    });

    try {
      const result = await fn(span);
      
      const duration = Date.now() - startTime;
      logger.info('span_end', `Finished span: ${name}`, {
        spanId,
        durationMs: duration,
        status: 'success',
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('span_end', `Failed span: ${name}`, {
        spanId,
        durationMs: duration,
        status: 'error',
      }, error as Error);
      throw error;
    }
  }
};
