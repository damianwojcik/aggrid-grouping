// build providers exactly like before, but with props baked in
const extensionProviders: React.ComponentType<any>[] = extensions
  .filter((ext) => !!ext.ContextProvider)
  .map((ext) => {
    const ContextProvider = ext.ContextProvider!;
    const propsForExtension = extensionProps?.[ext.name] || {};
    // return a component that only needs {children}
    return ({ children }: { children: React.ReactNode }) => (
      <ContextProvider {...propsForExtension}>{children}</ContextProvider>
    );
  });

// use your existing reducer
return wrapWithProviders(
  extensionProviders,
  <ExtensionsContextProvider extensions={extensions}>
    {children}
  </ExtensionsContextProvider>
);
