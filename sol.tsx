import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useGroups } from 'your-bbg-api'; // Replace with actual import

const API_KEY = 'your-api-key';

interface BloombergTerminalContextValue {
  isConnecting: boolean;
  isConnected: boolean;
  hasFailed: boolean;
  connect: () => void;
  reset: () => void;
  tcClient: any | null;
  groups: any;
}

const BloombergTerminalContext = createContext<BloombergTerminalContextValue | null>(null);

export const BloombergTerminalConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tcClient, setTcClient] = useState<any | null>(null);
  const tempClientRef = useRef<any | null>(null);

  // Groups from temp client (used for connection status)
  const tempGroups = useGroups(tempClientRef.current ?? undefined);

  // Groups from promoted (confirmed) client
  const finalGroups = useGroups(tcClient ?? undefined);

  const isConnecting = !!tempClientRef.current && tempGroups.loading;
  const isConnected = !!tempClientRef.current && !tempGroups.loading && !!tempGroups.data;
  const hasFailed = !!tempClientRef.current && Boolean(tempGroups.error);

  // 🔍 Log temp client and statuses
  useEffect(() => {
    console.log('🟡 tempClientRef.current changed:', tempClientRef.current);
  }, [tempClientRef.current]);

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
    if (isConnected && tempClientRef.current) {
      console.log('✅ Promoting tempClientRef → tcClient');
      setTcClient(tempClientRef.current);
      tempClientRef.current = null;
    }
  }, [isConnected]);

  useEffect(() => {
    console.log('📦 tcClient changed:', tcClient);
  }, [tcClient]);

  useEffect(() => {
    if (tcClient) {
      console.log('📊 Groups from tcClient:', finalGroups.data);
    }
  }, [finalGroups.data, tcClient]);

  const connect = () => {
    if (tcClient || tempClientRef.current) {
      console.log('⚠️ connect() ignored — already has client or tempClient');
      return;
    }

    const client = new window.TerminalConnectWebClient(API_KEY);
    tempClientRef.current = client;
    console.log('🚀 Created tempClientRef');
  };

  const reset = () => {
    console.log('🔁 Resetting both clients');
    tempClientRef.current = null;
    setTcClient(null);
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

export const useBloombergTerminal = () => {
  const ctx = useContext(BloombergTerminalContext);
  if (!ctx) {
    throw new Error('useBloombergTerminal must be used within BloombergTerminalConnectProvider');
  }
  return ctx;
};
