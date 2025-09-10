const ExtensionsHost = ({
  extensions,
  children,
}: {
  extensions: { name: string; ContextProvider?: React.ComponentType<any> }[];
  children: React.ReactNode;
}) => {
  // Now these hooks have providers above them in the tree
  const search = useSearchContext();
  const storage = useStorageContext();

  const extensionProps = React.useMemo(
    () => ({
      views: { test: "from panel", search, storage },
      // other extension props...
    }),
    [search, storage]
  );

  return (
    <ExtensionsContextProvider extensions={extensions}>
      {wrapExtensions(extensions, children, extensionProps)}
    </ExtensionsContextProvider>
  );
};

const wrapExtensions = (
  extensions: { name: string; ContextProvider?: React.ComponentType<any> }[],
  inner: JSX.Element,
  extensionProps?: Record<string, any>
) =>
  extensions.reduceRight((acc, ext, idx) => {
    if (!ext.ContextProvider) return acc;
    const propsForExtension = extensionProps?.[ext.name] || {};
    return (
      <ext.ContextProvider key={ext.name ?? idx} {...propsForExtension}>
        {acc}
      </ext.ContextProvider>
    );
  }, inner);

<AppContextProvider appName={appName} selectedViewId={selectedViewId} setSelectedViewId={setSelectedViewId}>
  <StorageContextProvider>
    <SearchContextProvider>
      <GridContextProvider>
        <ExtensionsHost extensions={extensions}>
          {children}
        </ExtensionsHost>
      </GridContextProvider>
    </SearchContextProvider>
  </StorageContextProvider>
</AppContextProvider>
