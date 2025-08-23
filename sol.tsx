import React, { createContext, useContext, useState } from 'react';

interface BloombergTerminalContextValue {
  isConnected: boolean;
  hasAttempted: boolean;
  hasFailed: boolean;
  connect: () => Promise<void>;
  reset: () => void; // manually allow retry
}

const BloombergTerminalContext = createContext<BloombergTerminalContextValue | null>(null);

export const BloombergTerminalConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  const connect = async () => {
    if (isConnected || hasAttempted) return;

    setHasAttempted(true);
    try {
      await window.bloomberg.connect(); // or your API
      setIsConnected(true);
      setHasFailed(false);
    } catch (err) {
      console.warn('Bloomberg connection failed:', err);
      setHasFailed(true);
    }
  };

  const reset = () => {
    setHasAttempted(false);
    setHasFailed(false);
    setIsConnected(false);
  };

  return (
    <BloombergTerminalContext.Provider value={{ isConnected, hasAttempted, hasFailed, connect, reset }}>
      {children}
    </BloombergTerminalContext.Provider>
  );
};

export const useBloombergTerminal = () => {
  const context = useContext(BloombergTerminalContext);
  if (!context) throw new Error('useBloombergTerminal must be used within BloombergTerminalConnectProvider');
  return context;
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
