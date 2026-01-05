export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  tenantId: string;
}

export interface ZentheaSession {
  data: {
    user: User;
  } | null;
  status: 'authenticated' | 'unauthenticated' | 'loading';
}

export interface AuthService {
  getSession(): ZentheaSession;
}
