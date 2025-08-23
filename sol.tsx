// BloombergTerminalConnectContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface BloombergTerminalContextValue {
  isConnected: boolean;
  connect: () => Promise<void>;
  // optionally expose Bloomberg API instance if needed
}

const BloombergTerminalContext = createContext<BloombergTerminalContextValue | null>(null);

export const BloombergTerminalConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const connect = async () => {
    if (isConnected || hasAttempted) return;

    setHasAttempted(true);

    try {
      // Your existing logic to connect to Bloomberg
      await window.bloomberg.connect(); // Replace with your actual connection logic
      setIsConnected(true);
    } catch (err) {
      console.warn('Bloomberg connection failed:', err);
      // no throw — prevent crash, just log
    }
  };

  return (
    <BloombergTerminalContext.Provider value={{ isConnected, connect }}>
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
import { useEffect, useState } from 'react';
import { useBloombergTerminal } from '../context/BloombergTerminalConnectContext';

const BloombergSettingsModal = () => {
  const { connect } = useBloombergTerminal();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const init = async () => {
      await connect();
      const data = await window.bloomberg.getGroups(); // Replace with your actual API call
      setGroups(data);
    };

    init();
  }, []);

  return (
    <div>
      {/* render your groups */}
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
