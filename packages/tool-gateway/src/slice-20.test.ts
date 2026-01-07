import * as assert from 'assert';
import { 
  IntegrationRequestEnvelopeSchema, 
  IntegrationResultEnvelopeSchema,
  IntegrationCapability,
  DataClassification,
  FailureTaxonomy
} from './integrations/types';
import { NoOpConnector } from './integrations/connector';
import { v4 as uuidv4 } from 'uuid';

async function testSlice20() {
  console.log('Running Slice 20 (External Integrations & Interop) governance tests...');

  const validConnectorId = { name: 'test-connector', version: '1.0.0' };
  const correlationId = uuidv4();

  // 1. IntegrationRequestEnvelopeSchema
  console.log('Testing IntegrationRequestEnvelopeSchema...');
  
  // Valid READ_ONLY
  const readRequest = {
    connectorId: validConnectorId,
    capability: 'READ_ONLY' as IntegrationCapability,
    classification: 'NONE' as DataClassification,
    purpose: 'Testing connectivity',
    correlationId,
  };
  assert.doesNotThrow(() => IntegrationRequestEnvelopeSchema.parse(readRequest), 'Valid READ_ONLY should pass');

  // Invalid WRITE_CONTROLLED (missing idempotency)
  const writeRequestNoIdem = {
    connectorId: validConnectorId,
    capability: 'WRITE_CONTROLLED' as IntegrationCapability,
    classification: 'NONE' as DataClassification,
    purpose: 'Writing data',
    correlationId,
  };
  assert.throws(() => IntegrationRequestEnvelopeSchema.parse(writeRequestNoIdem), /idempotency/, 'WRITE_CONTROLLED without idempotency should throw');

  // Valid WRITE_CONTROLLED
  const writeRequestWithIdem = {
    connectorId: validConnectorId,
    capability: 'WRITE_CONTROLLED' as IntegrationCapability,
    classification: 'NONE' as DataClassification,
    purpose: 'Writing data',
    correlationId,
    idempotency: { key: 'unique-key-123' }
  };
  assert.doesNotThrow(() => IntegrationRequestEnvelopeSchema.parse(writeRequestWithIdem), 'Valid WRITE_CONTROLLED should pass');
  console.log('✅ IntegrationRequestEnvelopeSchema verified');

  // 2. IntegrationResultEnvelopeSchema (Security)
  console.log('Testing IntegrationResultEnvelopeSchema (Security Boundary)...');
  
  // Reject payload/data
  const resultWithPayload = {
    status: 'SUCCESS',
    connectorId: validConnectorId,
    correlationId,
    classification: 'NONE',
    summary: { message: 'Success' },
    latencyMs: 100,
    data: { sensitive: 'should not be here' }
  };
  assert.throws(() => IntegrationResultEnvelopeSchema.parse(resultWithPayload), 'Results with "data" field must be rejected');

  const resultWithRawPayload = {
    status: 'SUCCESS',
    connectorId: validConnectorId,
    correlationId,
    classification: 'NONE',
    summary: { message: 'Success' },
    latencyMs: 100,
    payload: { sensitive: 'should not be here' }
  };
  assert.throws(() => IntegrationResultEnvelopeSchema.parse(resultWithRawPayload), 'Results with "payload" field must be rejected');

  // Strict schema (no extra fields)
  const resultWithExtra = {
    status: 'SUCCESS',
    connectorId: validConnectorId,
    correlationId,
    classification: 'NONE',
    summary: { message: 'Success' },
    latencyMs: 100,
    extraInfo: 'forbidden'
  };
  assert.throws(() => IntegrationResultEnvelopeSchema.parse(resultWithExtra), 'Strict schema must reject unknown fields');

  // Valid metadata result
  const validResult = {
    status: 'SUCCESS',
    connectorId: validConnectorId,
    correlationId,
    classification: 'PHI',
    summary: { 
      message: 'Records processed',
      recordCount: 5,
      bytesProcessed: 1024
    },
    latencyMs: 150
  };
  assert.doesNotThrow(() => IntegrationResultEnvelopeSchema.parse(validResult), 'Valid metadata-only result should pass');
  console.log('✅ IntegrationResultEnvelopeSchema security verified');

  // 3. Failure Taxonomy
  console.log('Testing Failure Taxonomy...');
  const validFailedResult = {
    status: 'FAILED',
    connectorId: validConnectorId,
    correlationId,
    classification: 'NONE',
    summary: { message: 'Failed' },
    error: {
      code: 'AUTH_FAILED' as FailureTaxonomy,
      message: 'Invalid credentials',
      isRetryable: false
    },
    latencyMs: 50
  };
  assert.doesNotThrow(() => IntegrationResultEnvelopeSchema.parse(validFailedResult));

  const invalidFailedResult = {
    ...validFailedResult,
    error: {
      ...validFailedResult.error,
      code: 'SOMETHING_RANDOM'
    }
  };
  assert.throws(() => IntegrationResultEnvelopeSchema.parse(invalidFailedResult), 'Invalid failure code must throw');
  console.log('✅ Failure taxonomy verified');

  // 4. NoOpConnector
  console.log('Testing NoOpConnector implementation...');
  const connector = new NoOpConnector();
  const request = {
    connectorId: validConnectorId,
    capability: 'READ_ONLY' as IntegrationCapability,
    classification: 'PHI' as DataClassification,
    purpose: 'Test NoOp',
    correlationId,
  };

  const result = connector.execute(request);
  assert.strictEqual(result.status, 'SUCCESS');
  assert.strictEqual(result.classification, 'PHI');
  assert.strictEqual((result as any).data, undefined);
  assert.strictEqual((result as any).payload, undefined);
  console.log('✅ NoOpConnector implementation verified');

  console.log('All Slice 20 tests passed! 🎯');
}

testSlice20().catch(err => {
  console.error('❌ Slice 20 Tests failed:');
  console.error(err);
  process.exit(1);
});
