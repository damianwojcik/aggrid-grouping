
    let newAction: Action;

    if (isFunction) {
      newAction = {
        id,
        label: stateLabel,
        description: stateDescription,
        active: false,
        mnemonic: stateMnemonic,
        inTab: stateInTab,
        tabName: stateTabName,
        panel: statePanel,
      } as FunctionAction;
    } else if (isLaunchpad) {
      newAction = {
        id,
        label: stateLabel,
        description: stateDescription,
        active: false,
        group: stateGroup,
      } as LaunchpadAction;
    } else {
      throw new Error("Must select either Launchpad or Function action type");
    }