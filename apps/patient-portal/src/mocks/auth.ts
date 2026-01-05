import { AuthService, ZentheaSession } from '../lib/contracts/auth';

export const mockSession: ZentheaSession = {
  data: {
    user: {
      id: 'mock-user-id',
      role: 'patient',
      name: 'Mock Patient',
      email: 'patient@example.com',
      tenantId: 'demo-tenant',
    },
  },
  status: 'authenticated',
};

export const mockAuthService: AuthService = {
  getSession: () => mockSession,
};
