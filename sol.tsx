const contextValue = useMemo(() => {
  const isConnecting = !!tempClient && tempGroups.loading;

  console.log('📦 memo recomputed → isConnecting:', isConnecting);

  return {
    isConnecting,
    isConnected: !!tempClient && !tempGroups.loading && !!tempGroups.data,
    hasFailed: !!tempClient && Boolean(tempGroups.error),
    connect,
    reset,
    tcClient,
    groups: tcClient ? finalGroups.data : null,
  };
}, [
  tempClient,
  tempGroups.loading,
  tempGroups.data,
  tempGroups.error,
  connect,
  reset,
  tcClient,
  finalGroups.data,
]);
