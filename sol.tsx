import React from "react";
import { ExtensionsContextProvider } from "./extensionsContext";

const ExtensionsHost = ({ extensions, children }) => {
  const storage = useStorageContext();
  const search  = useSearchContext();

  // Build props for each extension using parent contexts
  const extensionProps = React.useMemo(
    () => ({
      views: { test: "from panel", storage, search },
      // bloomberg: { ... },
    }),
    [storage, search]
  );

  return (
    <ExtensionsContextProvider extensions={extensions} extensionProps={extensionProps}>
      {children}
    </ExtensionsContextProvider>
  );
};

export const AxionFrameworkContextProvider = ({
  appName,
  selectedViewId,
  setSelectedViewId,
  extensions,
  children,
}) => {
  return (
    <AppContextProvider
      appName={appName}
      selectedViewId={selectedViewId}
      setSelectedViewId={setSelectedViewId}
    >
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
  );
};


import React, { createContext, useContext, useMemo } from "react";
import { wrapExtensions } from "./wrapExtensions";

type Extension = {
  name: string;
  ContextProvider?: React.ComponentType<any>;
};

interface ExtensionsContextValue {
  extensions: Extension[];
}

const ExtensionsContext = createContext<ExtensionsContextValue | null>(null);

export const useExtensionsContext = () => {
  const ctx = useContext(ExtensionsContext);
  if (!ctx) throw new Error("useExtensionsContext must be used inside ExtensionsContextProvider");
  return ctx;
};

interface ProviderProps {
  children: React.ReactNode;
  extensions: Extension[];
  extensionProps?: Record<string, any>;
}

export const ExtensionsContextProvider = ({
  children,
  extensions,
  extensionProps,
}: ProviderProps) => {
  const contextValue = useMemo(() => ({ extensions }), [extensions]);

  return (
    <ExtensionsContext.Provider value={contextValue}>
      {wrapExtensions(extensions, children, extensionProps)}
    </ExtensionsContext.Provider>
  );
};


export const wrapExtensions = (
  extensions: Extension[],
  children: React.ReactNode,
  extensionProps?: Record<string, any>
) =>
  extensions.reduceRight((acc, ext) => {
    const ContextProvider = ext.ContextProvider;
    if (!ContextProvider) return acc;
    const propsForExt = extensionProps?.[ext.name] || {};
    return (
      <ContextProvider key={ext.name} {...propsForExt}>
        {acc}
      </ContextProvider>
    );
  }, children);