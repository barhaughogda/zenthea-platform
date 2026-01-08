/* eslint-disable */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const useQuery = (api: any, args?: any) => null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const useMutation = (api: any) => () => Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const useAction = (api: any) => () => Promise.resolve();
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const ConvexProvider = ({ children }: any) => <>{children}</>;
export const ConvexReactClient = function() {
  return {
    query: () => Promise.resolve(null),
    mutation: () => Promise.resolve(),
    action: () => Promise.resolve(),
  };
};
