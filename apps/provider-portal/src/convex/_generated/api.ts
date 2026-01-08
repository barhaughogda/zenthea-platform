
export const api = new Proxy({}, {
  get: (target, prop) => {
    return new Proxy({}, {
      get: (target, prop) => {
        return `${String(prop)}`;
      }
    });
  }
}) as any;
