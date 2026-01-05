import { create } from 'zustand';

export const useNotificationsStore = create((set: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => ({
  notifications: [],
  setNotifications: (notifications: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => set({ notifications }),
}));
