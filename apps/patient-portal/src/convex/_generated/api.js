/* eslint-disable */
const handler = {
  get: function(target, prop) {
    if (prop === '__esModule') return true;
    return new Proxy(() => {}, handler);
  }
};

export const api = new Proxy({}, handler);
