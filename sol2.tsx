function ConditionalWrapper({ condition, wrapper, children }) {
  return condition ? wrapper(children) : children;
}

<ConditionalWrapper
  condition={!!message}
  wrapper={(children) => <div className="message">{children}</div>}
>
  <span>{message}</span>
</ConditionalWrapper>