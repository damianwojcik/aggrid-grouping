type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
  children: JSX.Element;
}

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({condition, wrapper, children}) => condition ? wrapper(children) : <>{children}</>


<ConditionalWrapper condition={isPanel} wrapper={(children) => <TerminalContextProvider>{children}</TerminalContextProvider>}>
<div className="app">{children}</div>
</ConditionalWrapper>