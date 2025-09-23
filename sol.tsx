const safeConnect: () => Promise<Client | null> = useCallback(
  async () => {
    try {
      return await connect();            // success
    } catch (e) {
      setError(e as Error);              // record error for UI
      return null;                       // swallow here
    }
  },
  [connect, setError]
);