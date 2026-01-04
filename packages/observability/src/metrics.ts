import { createLogger } from './logger';

const logger = createLogger('observability-metrics');

export interface MetricLabels extends Record<string, string | number | boolean | undefined> {
  tenantId?: string;
  service?: string;
  environment?: string;
}

export const metrics = {
  /**
   * Increment a counter
   */
  increment(name: string, value: number = 1, labels: MetricLabels = {}) {
    // For foundation, we just log the metric event
    // In a real implementation, this would send to Prometheus/StatsD
    logger.info('metric_increment', `Metric ${name} incremented by ${value}`, {
      metricName: name,
      metricValue: value,
      metricType: 'counter',
      ...labels,
    });
  },

  /**
   * Record a gauge value
   */
  gauge(name: string, value: number, labels: MetricLabels = {}) {
    logger.info('metric_gauge', `Metric ${name} set to ${value}`, {
      metricName: name,
      metricValue: value,
      metricType: 'gauge',
      ...labels,
    });
  },

  /**
   * Record a timing/histogram value
   */
  timing(name: string, durationMs: number, labels: MetricLabels = {}) {
    logger.info('metric_timing', `Metric ${name} took ${durationMs}ms`, {
      metricName: name,
      metricValue: durationMs,
      metricType: 'histogram',
      ...labels,
    });
  }
};
