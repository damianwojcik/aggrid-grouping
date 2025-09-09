// one tiny arrow fn, tolerant to both ContextProvider / ContextProvier
const wrapExtensions = (
  extensions: Array<{ name: string; ContextProvider?: React.ComponentType<any>; ContextProvier?: React.ComponentType<any> }>,
  inner: JSX.Element,
  extensionProps?: Record<string, any>
) =>
  extensions.reduceRight((acc, extension, index) => {
    const RawContextProvider =
      extension.ContextProvider ?? (extension as any).ContextProvier;
    if (!RawContextProvider) return acc;

    const propsForExtension = extensionProps?.[extension.name] || {};

    // keep keys like your previous reducer (not strictly required but harmless)
    return (
      <RawContextProvider key={index} {...propsForExtension}>
        {acc}
      </RawContextProvider>
    );
  }, inner);
