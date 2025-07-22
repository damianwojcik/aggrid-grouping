const wrapWithProviders = (
  providers: extension[] | undefined,
  children: JSX.Element | JSX.Element[]
): JSX.Element => {
  return (providers ?? []).reduceRight((acc, extension, index) => {
    const Provider = extension.ContextProvider;
    return <Provider key={index}>{acc}</Provider>;
  }, children);
};