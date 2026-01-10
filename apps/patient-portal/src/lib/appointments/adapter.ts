import { AppointmentBookingAgentClient, Appointment as SDKAppointment } from '@starter/appointment-booking-agent-sdk';
import { Appointment as UIAppointment } from '../contracts/patient';
import { ToolExecutionGateway, ToolAuditLogger } from '@starter/tool-gateway';
import { ControlPlaneContext } from '@starter/service-control-adapter';

/**
 * Adapter translating Appointment Booking Agent SDK responses to the Patient Portal UI contract.
 * 
 * Mandatory Constraints:
 * - No business logic
 * - No data enrichment
 * - No retries, caching, batching, or orchestration
 * - Minimal structured logging at boundaries
 */
export class AppointmentAgentAdapter {
  private client: AppointmentBookingAgentClient;
  private toolGateway: ToolExecutionGateway;
  private enableWrites: boolean;
  private ctx: ControlPlaneContext;

  constructor(config: { 
    baseUrl: string; 
    getToken?: () => Promise<string>;
    enableWrites?: boolean;
    ctx: ControlPlaneContext;
  }) {
    this.client = new AppointmentBookingAgentClient(config);
    this.toolGateway = new ToolExecutionGateway(new ToolAuditLogger());
    this.enableWrites = config.enableWrites || false;
    this.ctx = config.ctx;
  }

  async getAppointments(patientId: string): Promise<UIAppointment[]> {
    try {
      console.log('[AppointmentAgentAdapter] Fetching appointments', { 
        event: 'APPOINTMENTS_FETCH_START', 
        patientId: patientId.slice(0, 4) + '...' // Redacting PHI
      });
      const appointments = await this.client.getAppointments(this.ctx, patientId);
      
      const mapped = appointments.map((record: SDKAppointment) => this.mapToUI(record));
      
      console.log('[AppointmentAgentAdapter] Successfully fetched appointments', { 
        event: 'APPOINTMENTS_FETCH_SUCCESS', 
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        count: mapped.length 
      });
      return mapped;
    } catch (error) {
      console.error('[AppointmentAgentAdapter] Failed to fetch appointments', {
        event: 'APPOINTMENTS_FETCH_ERROR',
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async requestAppointment(params: {
    patientId: string;
    providerId: string;
    startTime: string;
    type: string;
    reason?: string;
  }): Promise<void> {
    if (!this.enableWrites) {
      throw new Error('APPOINTMENT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      agentVersion: '1.0.0',
      tool: { name: 'appointment.requestAppointment', version: '1.0.0' },
      parameters: params,
      approval: {
        approvedBy: params.patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `apt-req-${params.patientId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command, this.ctx);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }
  }

  async cancelAppointment(params: {
    patientId: string;
    appointmentRequestId: string;
    reason?: string;
  }): Promise<void> {
    if (!this.enableWrites) {
      throw new Error('APPOINTMENT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      agentVersion: '1.0.0',
      tool: { name: 'appointment.cancelAppointment', version: '1.0.0' },
      parameters: params,
      approval: {
        approvedBy: params.patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `apt-can-${params.appointmentRequestId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command, this.ctx);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }
  }

  private mapToUI(record: SDKAppointment): UIAppointment {
    const startDate = new Date(record.startTime);
    
    const provider: UIAppointment['provider'] = typeof record.provider === 'string'
      ? record.provider
      : {
          id: record.provider.id,
          name: record.provider.name,
          specialty: record.provider.specialty || 'General Medicine',
        };

    return {
    id: record.id,
    _id: record.id, // Compatibility with Convex-style mapping in page.tsx
    scheduledAt: startDate.getTime(), // Compatibility with Convex-style mapping in page.tsx
    date: startDate.toISOString().split('T')[0],
      time: startDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      provider,
      type: record.type,
      title: record.title,
      status: record.status,
      location: record.location,
      locationId: record.locationId,
      providerId: record.providerId,
      durationMinutes: record.durationMinutes,
      notes: record.notes,
    };
  }
}

/**
 * Mock implementation of the Appointment Service for development and testing.
 */
export class MockAppointmentAdapter {
  async getAppointments(patientId: string): Promise<UIAppointment[]> {
    console.log(`[MockAppointmentAdapter] Returning mock appointments for patient: ${patientId}`);
    return [];
  }

  async requestAppointment(params: unknown): Promise<void> {
    console.log('[MockAppointmentAdapter] Mock requestAppointment', params);
  }

  async cancelAppointment(params: unknown): Promise<void> {
    console.log('[MockAppointmentAdapter] Mock cancelAppointment', params);
  }
}
