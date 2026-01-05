/* eslint-disable */
import { create } from 'zustand';

export const useNotificationsStore = create((set: any) => ({
  notifications: [],
  setNotifications: (notifications: any) => set({ notifications }),
}));
