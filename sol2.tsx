const connect = useCallback((): Promise<typeof client> => {
  return new Promise((resolve, reject) => {
    // ---- your original connect body starts ----
    console.log('!!! connect isConnecting', { isConnecting });
    if (isConnecting) {
      console.log('!!! ⚠️ connect() ignored — already has client or tempClient');
      reject(new Error('Already connecting'));
      return;
    }

    const client = new web.TerminalConnectWebClient(BBG_API_KEY ?? '', options);
    setIsConnecting(true);
    setTargetMachineName(machineName);
    setGroupsData(undefined);
    setError(undefined);

    client.launchpad
      .groups()
      .then((result: launchpad.GroupsResult) => {
        if (result.__typename === 'Groups') {
          const parsedData = result.items
            .filter((group) => group != null)
            .map(parseGroup);
          setGroupsData(parsedData);
        }

        setTcClient(client);   // your original line
        resolve(client);       // <-- added
      })
      .catch((error: Error) => {
        setGroupsData(undefined);
        setError(error);
        reject(error);         // <-- added
      })
      .finally(() => {
        setIsConnecting(false);
      });
    // ---- your original connect body ends ----
  });
}, [options, isConnecting, machineName]);


onClickFunctionInPanel = async (action: FunctionContent) => {
  try {
    // waits until connect finishes and tcClient is ready
    const client = await storageRef.current.connect?.();  
    
    if (!client || !this.#security) return;

    client.functions.runFunctionInPanel({
      input: {
        mnemonic: action.mnemonic,
        panel: action.panel ?? PanelName.Zero,
        security1: this.#security,
      },
    });
  } catch (err) {
    console.error('Failed to connect:', err);
  }
};
