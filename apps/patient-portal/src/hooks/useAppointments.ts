import { mockAppointmentService } from '@/mocks/patient';

export const useAppointments = (..._args: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[]) => {
  return mockAppointmentService.getAppointments('mock-patient-id');
};

export const usePatientAppointments = useAppointments;

export type ConvexAppointment = any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */;
