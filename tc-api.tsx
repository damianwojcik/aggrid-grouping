export const FrameworkContextProvider = ({ extensions, children }) => {
  const extensionsProviders = extensions
    .map(ext => ext?.grid?.ContextProvider)
    .filter(Boolean); // only valid providers

  return (
    <AppContextProvider>
      <StorageContextProvider>
        {wrapWithProviders(
          extensionsProviders,
          <ExtensionsProvider extensions={extensions}>{children}</ExtensionsProvider>
        )}
      </StorageContextProvider>
    </AppContextProvider>
  );
};

const wrapWithProviders = (
  providers: React.ComponentType<{ children: React.ReactNode }>[],
  inner: JSX.Element
) => {
  return providers.reduceRight((acc, Provider, index) => {
    return <Provider key={index}>{acc}</Provider>;
  }, inner);
};