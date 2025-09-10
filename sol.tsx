export const ExtensionsContextProvider = ({
  children,
  extensions,
  extensionProps,
}: ProviderProps) => {
  const contextValue = useMemo(() => ({ extensions }), [extensions]);

  return (
    <ExtensionsContext.Provider value={contextValue}>
      {children}
    </ExtensionsContext.Provider>
  );
};