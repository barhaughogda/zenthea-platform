import { 
  IntegrationRequestEnvelope, 
  IntegrationResultEnvelope, 
  DataClassification,
  IntegrationRequestEnvelopeSchema
} from './types';

/**
 * 🔌 External Connector Interface
 * All external integrations must implement this contract.
 */
export interface IExternalConnector<TRequest extends IntegrationRequestEnvelope = IntegrationRequestEnvelope> {
  /**
   * Validates the request envelope against safety and governance rules.
   */
  validateRequest(envelope: TRequest): void;

  /**
   * Performs the external interaction (STUB ONLY for CP-20).
   * ⚠️ In a real implementation, this would orchestrate the network call.
   */
  execute(envelope: TRequest): IntegrationResultEnvelope;

  /**
   * Returns the data classification for a given request.
   */
  classify(envelope: TRequest): DataClassification;
}

/**
 * 🛡️ NoOp Connector
 * A governance-compliant connector that does nothing.
 * Used for testing and as a baseline for new connectors.
 */
export class NoOpConnector implements IExternalConnector {
  validateRequest(envelope: IntegrationRequestEnvelope): void {
    // Basic schema validation
    IntegrationRequestEnvelopeSchema.parse(envelope);
  }

  execute(envelope: IntegrationRequestEnvelope): IntegrationResultEnvelope {
    this.validateRequest(envelope);

    return {
      status: 'SUCCESS',
      connectorId: envelope.connectorId,
      correlationId: envelope.correlationId,
      classification: envelope.classification,
      summary: {
        message: 'NoOp execution successful (Stub)',
        recordCount: 0,
        bytesProcessed: 0,
      },
      latencyMs: 1,
    };
  }

  classify(envelope: IntegrationRequestEnvelope): DataClassification {
    return envelope.classification;
  }
}
