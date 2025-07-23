function createAction(): Action {
  const base = {
    id,
    label: stateLabel,
    description: stateDescription,
    active: false
  };

  if (isFunction) {
    return {
      ...base,
      mnemonic: stateMnemonic,
      inTab: stateInTab,
      tabName: stateTabName,
      panel: statePanel
    } satisfies FunctionAction;
  }

  if (isLaunchpad) {
    return {
      ...base,
      group: stateGroup
    } satisfies LaunchpadAction;
  }

  return base;
}

const newAction = createAction();
