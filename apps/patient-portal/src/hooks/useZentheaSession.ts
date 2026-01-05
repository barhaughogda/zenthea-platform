/* eslint-disable */
export const useZentheaSession = () => {
  return {
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
};
