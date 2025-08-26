const [tcClient, setTcClient] = useState<any | null>(null);
const tempClientRef = useRef<any | null>(null);

// Step 1: useGroups with temp client — for connection checking
const tempGroups = useGroups(tempClientRef.current ?? undefined);

// Step 2: useGroups with tcClient — only when it's set
const finalGroups = useGroups(tcClient ?? undefined); // ✅ safe

const isConnecting = !!tempClientRef.current && tempGroups.loading;
const isConnected = !!tempClientRef.current && !tempGroups.loading && !!tempGroups.data;
const hasFailed = !!tempClientRef.current && Boolean(tempGroups.error);

// ✅ Promote to real client only if connected
useEffect(() => {
  if (isConnected && tempClientRef.current) {
    setTcClient(tempClientRef.current);
    tempClientRef.current = null;
  }
}, [isConnected]);

// ✅ Expose only groups from fully connected client
const contextValue = useMemo(() => ({
  isConnecting,
  isConnected,
  hasFailed,
  connect,
  reset,
  tcClient,
  groups: finalGroups.data, // ✅ only from confirmed tcClient
}), [isConnecting, isConnected, hasFailed, connect, reset, tcClient, finalGroups.data]);
