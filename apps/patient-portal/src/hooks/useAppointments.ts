import { useState, useEffect, useMemo, useCallback } from 'react';
import { useZentheaSession } from './useZentheaSession';
import { useFeatureFlag } from '@/config/features';
import { AppointmentAgentAdapter } from '@/lib/appointments/adapter';
import { Appointment } from '@/lib/contracts/patient';
import { mockAppointmentService } from '@/mocks/patient';
import { ControlPlaneContext } from '@starter/service-control-adapter';

export const useAppointments = (status?: string) => {
  const { data: session } = useZentheaSession();
  const useRealAgent = useFeatureFlag('USE_REAL_APPOINTMENT_BOOKING_AGENT');
  const enableWrites = useFeatureFlag('USE_APPOINTMENT_WRITES');
  const patientId = session?.user?.id || 'mock-patient-id';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CP-21: Derive Governance Context from Session
  const ctx = useMemo<ControlPlaneContext | null>(() => {
    if (!session?.user?.id) return null;
    return {
      traceId: crypto.randomUUID(),
      actorId: session.user.id,
      policyVersion: '1.0.0',
    };
  }, [session]);

  const adapter = useMemo(() => {
    if (useRealAgent && ctx) {
      return new AppointmentAgentAdapter({
        baseUrl: process.env.NEXT_PUBLIC_APPOINTMENT_BOOKING_AGENT_URL || 'http://localhost:3002',
        enableWrites,
        ctx,
      });
    }
    return null;
  }, [useRealAgent, enableWrites, ctx]);

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

  const cancelAppointment = useCallback(async (appointmentRequestId: string, reason?: string) => {
    if (!adapter) {
      console.log('[useAppointments] Mock cancelAppointment', { appointmentRequestId, reason });
      return;
    }
    await adapter.cancelAppointment({ patientId, appointmentRequestId, reason });
  }, [adapter, patientId]);

  const requestAppointment = useCallback(async (params: { providerId: string; startTime: string; type: string; reason?: string }) => {
    if (!adapter) {
      console.log('[useAppointments] Mock requestAppointment', params);
      return;
    }
    await adapter.requestAppointment({ ...params, patientId });
  }, [adapter, patientId]);

  return {
    appointments: filteredAppointments,
    isLoading,
    error,
    patientId,
    requestAppointment,
    cancelAppointment,
    enableWrites,
  };
};

export const usePatientAppointments = useAppointments;

export type ConvexAppointment = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */;
