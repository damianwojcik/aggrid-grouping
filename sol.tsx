// one small helper; no wrapper components created
const wrapExtensions = (
  extensions: { name: string; ContextProvider?: React.ComponentType<any> }[],
  inner: React.ReactNode,
  extensionProps?: Record<string, any>
) =>
  extensions
    .filter((e) => !!e.ContextProvider)
    .reduceRight((acc, ext, index) => {
      const ContextProvider = ext.ContextProvider!;
      const propsForExtension = extensionProps?.[ext.name];

      return propsForExtension ? (
        <ContextProvider key={index} {...propsForExtension}>
          {acc}
        </ContextProvider>
      ) : (
        <ContextProvider key={index}>{acc}</ContextProvider>
      );
    }, inner);
