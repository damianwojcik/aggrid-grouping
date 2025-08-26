const status = useMemo(() => {
  const isConnecting = !!tempTcClient && tempGroups.loading;
  const isConnected = !!tempTcClient && !tempGroups.loading && !!tempGroups.data;
  const hasFailed = !!tempTcClient && Boolean(tempGroups.error);

  return { isConnecting, isConnected, hasFailed };
}, [
  tempTcClient,
  tempGroups.loading,
  tempGroups.data,
  tempGroups.error,
]);