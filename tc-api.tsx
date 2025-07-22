type extension<Props = {}> = {
  ContextProvider: React.ComponentType<Props & { children?: React.ReactNode }>
}