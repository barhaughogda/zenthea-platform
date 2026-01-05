import { create } from 'zustand';

export const useAppointmentsStore = create((set: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => ({
  appointments: [],
  setAppointments: (appointments: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => set({ appointments }),
}));
