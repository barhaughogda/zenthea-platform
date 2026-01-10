/**
 * Hook to derive ControlPlaneContext from the current session.
 * CP-21: Mandatory context for all governed write operations.
 */
export const useControlPlaneContext = () => {
  const { data: session } = useZentheaSession();

  return useMemo(() => {
    // Generate a fresh trace ID for each context instance
    const traceId = `trace-${typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2)}`;
    
    // Actor ID is derived from the session user ID
    // Policy version is hardcoded to 'v1' for Phase D-5
    const actorId = session?.user?.id || 'anonymous';
    const policyVersion = 'v1';

    return {
      traceId,
      actorId,
      policyVersion,
    };
  }, [session?.user?.id]);
};
