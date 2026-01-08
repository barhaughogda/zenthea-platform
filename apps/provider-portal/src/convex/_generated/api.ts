/* eslint-disable */

export const api = new Proxy({}, {
  get: (target, prop) => {
    return new Proxy({}, {
      get: (target, prop) => {
        return `${String(prop)}`;
      }
    });
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
}) as any;
