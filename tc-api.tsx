import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TerminalConnectContext = createContext(null);

export const TerminalConnectContextProvider = ({ children }) => {
  const { machineName } = useStorageContext();
  const [tcClient, setTcClient] = useState<TerminalConnectWebClient | undefined>(undefined);
  const [groups, setGroups] = useState<any>(undefined); // Replace with your groups type

  useEffect(() => {
    const options = machineName
      ? { endpoints: { terminal: { hostname: createURL(machineName), port: 1444 } } }
      : undefined;

    const client = new TerminalConnectWebClient(API_KEY ?? '', options);

    setTcClient(client);

    const abortController = new AbortController();

    const fetchGroups = async () => {
      const data = await useGroups(client, { signal: abortController.signal });
      if (!abortController.signal.aborted) {
        setGroups(data);
      }
    };

    fetchGroups();

    return () => {
      abortController.abort();
      client?.disconnect?.();
      setGroups(undefined);
      setTcClient(undefined);
    };
  }, [machineName]);

  const contextValue = useMemo(() => ({
    tcClient,
    groups,
  }), [tcClient, groups]);

  return (
    <TerminalConnectContext.Provider value={contextValue}>
      {children}
    </TerminalConnectContext.Provider>
  );
};

export const useTerminalConnectContext = () => useContext(TerminalConnectContext);
