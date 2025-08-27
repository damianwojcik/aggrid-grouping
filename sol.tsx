


export const BloombergTerminalConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tcClient, setTcClient] = useState<any | undefined>(null);
  const [tempTcClient, setTempTcClient] = useState<any | undefined>(undefined);

  // FIXME: why below is not called again once tempTcClient change? I dont get updated isConnecting
  const tempGroups = useGroups(tempTcClient ?? undefined);
  const finalGroups = useGroups(tcClient ?? undefined);

  const isConnecting = useMemo(() => !!tempGroups.loading && !tempGroups.data && !tempGroups.error, [tempGroups.loading, tempGroups.data, tempGroups.error]);
  const isConnected = useMemo(() => !tempGroups.loading && !!tempGroups.data && !tempGroups.error, [tempGroups.loading, tempGroups.data, tempGroups.error]);
  const hasFailed = useMemo(() => !tempGroups.loading && !!tempGroups.data && !tempGroups.error, [tempGroups.loading, tempGroups.data, tempGroups.error]);

  // 🔍 Log temp client and statuses
  useEffect(() => {
    console.log('🟡 tempTcClient changed:', tempTcClient);
  }, [tempTcClient]);

  useEffect(() => {
    console.log('🟡 isConnecting:', isConnecting);
  }, [isConnecting]);

  useEffect(() => {
    console.log('🟢 isConnected:', isConnected);
  }, [isConnected]);

  useEffect(() => {
    console.log('🔴 hasFailed:', hasFailed);
  }, [hasFailed]);

  // 🔁 Promote to stateful client once connected
  useEffect(() => {
    if (isConnected && tempTcClient) {
      console.log('✅ Promoting tempClientRef → tcClient');
      setTcClient(tempTcClient);
      setTempTcClient(undefined);
    }
  }, [isConnected, tempTcClient]);

  useEffect(() => {
    console.log('📦 tcClient changed:', tcClient);
  }, [tcClient]);

  useEffect(() => {
    if (tcClient) {
      console.log('📊 Groups from tcClient:', finalGroups.data);
    }
  }, [finalGroups.data, tcClient]);

  const connect = () => {
    if (tcClient || tempTcClient) {
      console.log('⚠️ connect() ignored — already has client or tempClient');
      return;
    }

    const client = new window.TerminalConnectWebClient(API_KEY);
    setTempTcClient(client);
    console.log('🚀 Created tempClientRef');
  };

  const reset = () => {
    console.log('🔁 Resetting both clients');
    setTempTcClient(undefined);
    setTcClient(undefined);
  };

  const contextValue = useMemo(() => ({
    isConnecting,
    isConnected,
    hasFailed,
    connect,
    reset,
    tcClient,
    groups: tcClient ? finalGroups.data : null,
  }), [
    isConnecting,
    isConnected,
    hasFailed,
    connect,
    reset,
    tcClient,
    finalGroups.data,
  ]);

  return (
    <BloombergTerminalContext.Provider value={contextValue}>
      {children}
    </BloombergTerminalContext.Provider>
  );
};

export const useGroups = (tcClient: TCClinet | undefined) => {
  const [data, setData] = useState(initialGroupsState.data);
  const [error, setError] = useState(initialGroupsState.error);
  const [loading, setLoading] = useState(initialGroupsState.loading);

  useEffect(() => {
    // Reset state to initial values on client change
    setData(initialGroupsState.data);
    setError(initialGroupsState.error);
    setLoading(initialGroupsState.loading);

    if (!tcClient) return;

    setLoading(true);

    tcClient.launchpad
      .groups()
      .then((result: launchpad.GroupsResult) => {
        if (result.__typename === 'Groups') {
          const parsedData = result.items
            .filter((group) => group != null)
            .map((group) => ({
              id: group.id,
              name: group?.name ?? '',
              type: group?.type ?? '',
              value: group?.value ?? '',
            }));

          setData(parsedData);
        }
      })
      .catch((error: Error) => {
        setData(initialGroupsState.data);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [tcClient]);

  return { data, error, loading };

}




export const BloombergContextProvider = ({ children }) => {
  const [bloombergModalVisible, setBloombergModalVisible] = useState(false);
  const contextValues = useMemo(() => ({
    bloombergModalVisible, setBloombergModalVisible
  }), [bloombergModalVisible, setBloombergModalVisible])

  return (
    <BloombergContext.Provider value={contextValues}>
      <StorageContextProvider>
        <BloombergTerminalContextProvider>{children}</BloombergTerminalContextProvider>
      </StorageContextProvider>
    </BloombergContext.Provider>
  );
};


// it is wrapped by all contextes
const Component = () => {
  const { isConnecting } = useBloombergTerminal();

  useEffect(() => {
    console.log('!!! isConnecting changed', { isConnecting }); // FIXME: this is not getting updates
  }, [isConnecting])

}