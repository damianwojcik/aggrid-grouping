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

  // ✅ UseGroups on temp client to determine status
  const tempGroups = useGroups(tempClientRef.current ?? undefined);

  // ✅ UseGroups on confirmed client only
  const finalGroups = useGroups(tcClient ?? undefined);

  // ✅ Statuses ONLY from temp client
  const isConnecting = !!tempClientRef.current && tempGroups.loading;
  const isConnected = !!tempClientRef.current && !tempGroups.loading && !!tempGroups.data;
  const hasFailed = !!tempClientRef.current && Boolean(tempGroups.error);

  // ✅ Promote client to state ONLY if connection is successful
  useEffect(() => {
    if (isConnected && tempClientRef.current) {
      setTcClient(tempClientRef.current);
      tempClientRef.current = null;
    }
  }, [isConnected]);

  const connect = () => {
    if (tcClient || tempClientRef.current) return;

    const client = new window.TerminalConnectWebClient(API_KEY);
    tempClientRef.current = client;
  };

  const reset = () => {
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
    groups: tcClient ? finalGroups.data : null, // ✅ use only when promoted
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
