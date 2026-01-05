import { useState, useEffect, useMemo } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { AppointmentAgentAdapter, MockAppointmentAdapter } from '@/lib/appointments/adapter';
import { Appointment } from '@/lib/contracts/patient';
import { mockAppointmentService } from '@/mocks/patient';

export const useAppointments = (status?: string) => {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_APPOINTMENT_BOOKING_AGENT');
  const patientId = session?.user?.id || 'mock-patient-id';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const adapter = useMemo(() => {
    if (useRealAgent) {
      return new AppointmentAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_APPOINTMENT_BOOKING_AGENT_URL || 'http://localhost:3002',
      });
    }
    return null;
  }, [useRealAgent]);

  useEffect(() => {
    if (!useRealAgent) {
      // Use existing mock behavior
      const mockResult = mockAppointmentService.getAppointments(patientId);
      setAppointments(mockResult.appointments);
      setIsLoading(mockResult.isLoading);
      return;
    }

    if (adapter && patientId) {
      setIsLoading(true);
      adapter.getAppointments(patientId)
        .then(data => {
          setAppointments(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('[useAppointments] Error fetching appointments:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
          setIsLoading(false);
        });
    }
  }, [useRealAgent, adapter, patientId]);

  // Filter by status if provided
  const filteredAppointments = useMemo(() => {
    if (!status || status === 'all') return appointments;
    return appointments.filter(apt => apt.status === status);
  }, [appointments, status]);

  return {
    appointments: filteredAppointments,
    isLoading,
    error,
    patientId,
  };
};

export const usePatientAppointments = useAppointments;

export type ConvexAppointment = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */;
