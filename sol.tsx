const expandAllChildren = (node: RowNode): void => {
  node.childrenAfterGroup?.forEach((child) => {
    child.setExpanded(true);
    expandAllChildren(child);
  });
};