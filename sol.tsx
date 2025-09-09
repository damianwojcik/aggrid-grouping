// framework/AxionFrameworkContextProvider.tsx
import React from 'react';

export function AxionFrameworkContextProvider({
  extensions,
  extensionProps = {}, // { [name]: props }
  children,
}) {
  // Wrap children with each extension provider, passing props by name
  const wrapped = extensions
    .map((ext) => {
      const Provider = ext.ContextProvider;
      const propsForThisExt = extensionProps[ext.name] || {};
      return (inner) => <Provider {...propsForThisExt}>{inner}</Provider>;
    })
    .reduceRight((acc, WithP) => WithP(acc), children);

  // Add your other app providers around `wrapped` if needed
  return wrapped;
}


// package/panel/Panel.tsx
import React from 'react';
import { AxionFrameworkContextProvider } from 'framework/AxionFrameworkContextProvider';
import { extensionConfig as viewsExt } from 'package/views/extensionConfig';

const extensions = [viewsExt];

export default function Panel() {
  return (
    <AxionFrameworkContextProvider
      extensions={extensions}
      extensionProps={{
        views: { test: 'value known only in panel' }, // ← real values live here
      }}
    >
      <App />
    </AxionFrameworkContextProvider>
  );
}
