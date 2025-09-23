// keep inside the component (because it uses setError), but make it generic
const withErrorHandling = useCallback(
  <T,>(fn: () => Promise<T>) => {
    return async (): Promise<T> => {
      try {
        return await fn();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    };
  },
  [setError]
);

// connect already is: () => Promise<TerminalConnectWebClient>
const safeConnect = useMemo(
  () => withErrorHandling(connect),
  [connect, withErrorHandling]
);

// context value now matches the type exactly
const contextValue = useMemo(
  () => ({
    tcClient,
    groupsData,
    isConnecting,
    isConnected: !!groupsData,
    hasFailed: !!error,
    targetMachineName,
    connect: safeConnect, // ✅ () => Promise<TerminalConnectWebClient>
  }),
  [tcClient, groupsData, isConnecting, error, targetMachineName, safeConnect]
);
