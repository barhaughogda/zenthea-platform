import React from 'react';
export const useQuery = (api: any, args?: any) => null;
export const useMutation = (api: any) => () => Promise.resolve();
export const useAction = (api: any) => () => Promise.resolve();
export const ConvexProvider = ({ children }: any) => <>{children}</>;
export const ConvexReactClient = function() {
  return {
    query: () => Promise.resolve(null),
    mutation: () => Promise.resolve(),
    action: () => Promise.resolve(),
  };
};
