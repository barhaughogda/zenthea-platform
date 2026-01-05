/* eslint-disable */
import { create } from 'zustand';

export const useAppointmentsStore = create((set: any) => ({
  appointments: [],
  setAppointments: (appointments: any) => set({ appointments }),
}));
