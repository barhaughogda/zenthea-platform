import { AppointmentBookingAgentClient, Appointment as SDKAppointment } from '@starter/appointment-booking-agent-sdk';
import { Appointment as UIAppointment, AppointmentService } from '../contracts/patient';

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

  constructor(config: { baseUrl: string; getToken?: () => Promise<string> }) {
    this.client = new AppointmentBookingAgentClient(config);
  }

  async getAppointments(patientId: string): Promise<UIAppointment[]> {
    try {
      console.log('[AppointmentAgentAdapter] Fetching appointments', { 
        event: 'APPOINTMENTS_FETCH_START', 
        patientId 
      });
      const appointments = await this.client.getAppointments(patientId);
      
      const mapped = appointments.map((record: SDKAppointment) => this.mapToUI(record));
      
      console.log('[AppointmentAgentAdapter] Successfully fetched appointments', { 
        event: 'APPOINTMENTS_FETCH_SUCCESS', 
        patientId, 
        count: mapped.length 
      });
      return mapped;
    } catch (error) {
      console.error('[AppointmentAgentAdapter] Failed to fetch appointments', {
        event: 'APPOINTMENTS_FETCH_ERROR',
        patientId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  private mapToUI(record: SDKAppointment): UIAppointment {
    const startDate = new Date(record.startTime);
    
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
      provider: record.provider,
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
}
