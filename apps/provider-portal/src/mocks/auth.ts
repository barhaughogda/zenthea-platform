/* eslint-disable */
export const mockAuthService = {
  getSession: () => ({
    data: {
      user: {
        id: "mock-user-id",
        name: "Mock Provider",
        email: "provider@example.com",
        role: "owner",
        tenantId: "mock-tenant-id",
      },
    },
    status: "authenticated",
  }),
};
