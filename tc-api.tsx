// 🔹 Type Definitions
interface BaseAction {
  id: string;
  label: string;
  description: string;
  active: boolean;
}

interface LaunchpadAction extends BaseAction {
  group: string;
}

interface FunctionAction extends BaseAction {
  mnemonic: string;
  inTab: boolean;
  tabName: string;
  panel: string;
}

type Action = BaseAction | LaunchpadAction | FunctionAction;

 const handleSave = () => {
    const id = crypto.randomUUID();

    // 🔹 Build base action
    const base: BaseAction = {
      id,
      label: stateLabel,
      description: stateDescription,
      active: false,
    };

    // 🔹 Dynamically build and assert type
    let newAction: Action;

    if (isFunction) {
      newAction = {
        ...base,
        mnemonic: stateMnemonic,
        inTab: stateInTab,
        tabName: stateTabName,
        panel: statePanel,
      } as FunctionAction;
    } else if (isLaunchpad) {
      newAction = {
        ...base,
        group: stateGroup,
      } as LaunchpadAction;
    } else {
      newAction = base;
    }