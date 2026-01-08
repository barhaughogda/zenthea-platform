/* eslint-disable */
export const useAppointments = (status?: string) => {
  return {
    appointments: [],
    isLoading: false,
    error: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
    requestAppointment: async (params: any) => {},
    cancelAppointment: async (id: string, reason?: string) => {},
  };
};
export type ConvexAppointment = any;
