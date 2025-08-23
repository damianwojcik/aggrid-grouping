// BloombergTerminalConnectContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useGroups } from 'your-bbg-lib'; // adjust import

const API_KEY = 'your-api-key';

interface BloombergTerminalContextValue {
  isConnected: boolean;
  hasAttempted: boolean;
  hasFailed: boolean;
  connect: () => void;
  reset: () => void;
  tcClient: any | null;
}

const BloombergTerminalContext = createContext<BloombergTerminalContextValue | null>(null);

export const BloombergTerminalConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tcClient, setTcClient] = useState<any | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const connect = () => {
    if (tcClient || hasAttempted) return;

    setHasAttempted(true);
    try {
      const client = new window.TerminalConnectWebClient(API_KEY);
      setTcClient(client);
    } catch (err) {
      console.warn('Failed to create Bloomberg client:', err);
    }
  };

  const reset = () => {
    setTcClient(null);
    setHasAttempted(false);
  };

  // Use BBG hook once we have a client
  const { loading, error, data } = useGroups(tcClient);

  const isConnected = !!data && !loading;
  const hasFailed = !!error;

  const contextValue = useMemo(() => ({
    isConnected,
    hasAttempted,
    hasFailed,
    connect,
    reset,
    tcClient,
  }), [isConnected, hasAttempted, hasFailed, connect, reset, tcClient]);

  return (
    <BloombergTerminalContext.Provider value={contextValue}>
      {children}
    </BloombergTerminalContext.Provider>
  );
};

export const useBloombergTerminal = () => {
  const ctx = useContext(BloombergTerminalContext);
  if (!ctx) throw new Error('useBloombergTerminal must be used within BloombergTerminalConnectProvider');
  return ctx;
};


// modal
import { useBloombergTerminal } from '../context/BloombergTerminalConnectContext';

const BloombergSettingsModal = () => {
  const { isConnected, hasFailed, connect, reset } = useBloombergTerminal();

  // TODO instead of this add this lazy to group dropdown as in cellRenderer
  useEffect(() => {
    connect();
  }, []);

  const handleRetry = async () => {
    reset();
    await connect();
  };

  return (
    <div>
      {!isConnected && hasFailed && (
        <div>
          <p>Bloomberg connection failed. Please make sure the app is running.</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {isConnected && (
        <p>Bloomberg connected!</p>
      )}
    </div>
  );
};


// cellRenderer
import { useBloombergTerminal } from '../context/BloombergTerminalConnectContext';

const BBGActionButton = ({ rowData }) => {
  const { connect } = useBloombergTerminal();

  const handleClick = async () => {
    await connect();
    await window.bloomberg.performAction(rowData); // Replace with actual method
  };

  return <button onClick={handleClick}>BBG Action</button>;
};
