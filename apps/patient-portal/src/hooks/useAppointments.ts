/* eslint-disable */
export const useAppointments = (...args: any[]) => {
  return {
    appointments: [] as any[],
    isLoading: false,
    patientId: 'mock-patient-id',
  };
};

export const usePatientAppointments = useAppointments;

export type ConvexAppointment = any;
