const wrapWithProviders = (providers: extension[], children: React.ReactNode): React.ReactNode => {
  return providers.reduceRight((acc, extension, index) => {
    const Provider = extension.ContextProvider;
    return <Provider key={index}>{acc}</Provider>;
  }, children);
};

return (
  <AppContextProvider>
    <StorageContextProvider>
      <GridContextProvider>
        {wrapWithProviders(extensions, children)}
      </GridContextProvider>
    </StorageContextProvider>
  </AppContextProvider>
);