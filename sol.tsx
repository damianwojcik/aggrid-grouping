import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useGroups } from 'your-bbg-api'; // Replace with actual path

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

  // ✅ Safe connect: creates temp client, checks connection, promotes only if valid
  const connect = () => {
    if (tcClient || tempClientRef.current) return;

    const client = new window.TerminalConnectWebClient(API_KEY);
    tempClientRef.current = client;
  };

  const reset = () => {
    tempClientRef.current = null;
    setTcClient(null);
  };

  // ✅ useGroups for temp client: connection checking
  const tempGroups = useGroups(tempClientRef.current ?? undefined);

  // ✅ useGroups for real client: only once it's confirmed
  const finalGroups = useGroups(tcClient ?? undefined);

  const isConnecting = !!tempClientRef.current && tempGroups.loading;
  const isConnected = !!tempClientRef.current && !tempGroups.loading && !!tempGroups.data;
  const hasFailed = !!tempClientRef.current && Boolean(tempGroups.error);

  // ✅ Promote temp client to state only when connected
  useEffect(() => {
    if (isConnected && tempClientRef.current) {
      setTcClient(tempClientRef.current);
      tempClientRef.current = null;
    }
  }, [isConnected]);

  const contextValue = useMemo(() => ({
    isConnecting,
    isConnected,
    hasFailed,
    connect,
    reset,
    tcClient,
    groups: finalGroups.data, // ✅ only from confirmed client
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
