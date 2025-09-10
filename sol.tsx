const ExtensionsHost = ({
  extensions,
  children,
}: {
  extensions: { name: string; ContextProvider?: React.ComponentType<any> }[];
  children: React.ReactNode;
}) => {
  const search = useSearchContext();
  const storage = useStorageContext();

  const extensionProps = React.useMemo(
    () => ({
      views: { test: "from panel", search, storage },
    }),
    [search, storage]
  );

  return wrapExtensions(
    extensions,
    <ExtensionsContextProvider extensions={extensions}>
      {children}
    </ExtensionsContextProvider>,
    extensionProps
  );
};
