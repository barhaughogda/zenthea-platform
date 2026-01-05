/**
 * Scheduling System Adapter Interface
 *
 * Defines the contract for interacting with external scheduling systems
 * (e.g., Epic EHR, Google Calendar).
 *
 * NOTE: This agent only performs READ operations via this interface.
 * WRITE operations must go through the Tool Execution Gateway.
 */
export interface ISchedulingSystemAdapter {
  /**
   * Fetch available slots for a provider.
   */
  getAvailableSlots(params: {
    providerId: string;
    start: Date;
    end: Date;
  }): Promise<any[]>;

  /**
   * Get details of an existing appointment.
   */
  getAppointment(appointmentId: string): Promise<any | null>;

  /**
   * Check for conflicts in the external system.
   */
  checkConflict(params: {
    providerId: string;
    startTime: Date;
    endTime: Date;
  }): Promise<boolean>;
}

/**
 * Integrations Layer Entry Point
 */
export const Integrations = {
  // Placeholder for vendor-specific adapter implementations.
  // TODO: Implement EpicEhrAdapter.
  // TODO: Implement GoogleCalendarAdapter.
};
