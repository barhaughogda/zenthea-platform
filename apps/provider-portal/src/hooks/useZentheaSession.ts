import { mockAuthService } from '@/mocks/auth';

export const useZentheaSession = () => {
  return mockAuthService.getSession() as any;
};
