/* eslint-disable */
import { mockAuthService } from '@/mocks/auth';

export const useZentheaSession = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
  return mockAuthService.getSession() as any;
};
