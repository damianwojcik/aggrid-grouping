// Extension has optional ContextProvider
type Extension = { name: string; ContextProvider?: React.ComponentType<any> };

const wrapExtensions = (
  extensions: Extension[],
  inner: React.ReactNode,
  extensionProps?: Record<string, any>
) =>
  extensions.reduceRight((acc, ext) => {
    const ContextProvider = ext.ContextProvider;
    if (!ContextProvider) return acc; // skip extensions without a provider
    const props = extensionProps?.[ext.name] || {};
    return <ContextProvider key={ext.name} {...props}>{acc}</ContextProvider>;
  }, inner);
