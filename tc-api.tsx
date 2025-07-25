export const FrameworkContextProvider = ({extensions, children}) => {

const extensionsProviders = extensions.map(extension => extension.ContextProvider);
return(
  <AppContextProvider>
    <StorageContextProvider>
      {/* modify extensions now to be extensionsProivders from ln3, modify wrapWithProviders fn */}
      {wrapWithProviders(extensions, children)}
    </StorageContextProvider>
  </AppContextProvider>
)

}

const wrapWithProviders = (
  providers: React.ComponentType<{ children: React.ReactNode }>[],
  children: JSX.Element | JSX.Element[]
) => {
  return providers.reduceRight((acc, Provider, index) => {
    return <Provider key={index}>{acc}</Provider>;
  }, children as JSX.Element);
};