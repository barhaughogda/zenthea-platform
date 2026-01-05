/**
 * Appointment Intent: Represents the user's expressed desire for a scheduling action.
 */
export interface AppointmentIntent {
  patientId: string;
  type: 'new' | 'reschedule' | 'cancel';
  reason?: string;
  preferredProviderId?: string;
  timePreferences?: {
    earliest: Date;
    latest: Date;
    daysOfWeek?: number[]; // 0-6
  };
}

/**
 * Appointment Slot: Represents a potential or existing time block for an appointment.
 */
export interface AppointmentSlot {
  slotId: string;
  providerId: string;
  startTime: Date;
  endTime: Date;
  locationId?: string;
  status: 'available' | 'reserved' | 'booked' | 'blocked';
}

/**
 * Scheduling Action: Defines the specific operation proposed to the platform.
 */
export interface SchedulingAction {
  actionId: string;
  actionType: 'create' | 'update' | 'delete';
  targetSystem: string; // e.g., 'epic-ehr', 'google-calendar'
  payload: {
    appointmentId?: string;
    patientId: string;
    providerId: string;
    startTime: Date;
    endTime: Date;
    [key: string]: any;
  };
  metadata: {
    proposedBy: string; // agent-id
    proposalTimestamp: Date;
    idempotencyKey: string;
  };
}

/**
 * Domain Validation logic (Pure)
 */
export const DomainValidator = {
  /**
   * Ensure the proposed slot is within allowed bounds.
   */
  isValidSlot(slot: AppointmentSlot): boolean {
    // TODO: Implement invariant checks (e.g., duration >= 15m, in future).
    return slot.startTime < slot.endTime && slot.startTime > new Date();
  },

  /**
   * Validate if an intent is complete enough to process.
   */
  isIntentValid(intent: AppointmentIntent): boolean {
    // TODO: Implement completeness checks.
    return !!intent.patientId && !!intent.type;
  },
};
