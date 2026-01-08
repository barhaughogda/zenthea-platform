export const useAppointments = (status?: string) => {
  return {
    appointments: [],
    isLoading: false,
    error: null,
    requestAppointment: async (params: any) => {},
    cancelAppointment: async (id: string, reason?: string) => {},
  };
};

export type ConvexAppointment = any;
