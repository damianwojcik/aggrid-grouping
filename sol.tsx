const wrapExtensions = (
  extensions: { name: string; ContextProvider?: React.ComponentType<any> }[],
  inner: JSX.Element,
  extensionProps?: Record<string, any>
) =>
  extensions.reduceRight((acc, extension) => {
    const ContextProvider = extension.ContextProvider;
    if (!ContextProvider) return acc;
    const propsForExtension = extensionProps?.[extension.name] || {};
    return <ContextProvider {...propsForExtension}>{acc}</ContextProvider>;
  }, inner);


  return wrapExtensions(
  extensions,
  <ExtensionsContextProvider extensions={extensions}>
    {children}
  </ExtensionsContextProvider>,
  {
    views: { test: "from panel" }, // 👈 passed to ViewsContextProvider
  }
);
