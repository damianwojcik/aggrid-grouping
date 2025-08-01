const toggleAllChildren = (node: RowNode): void => {
  const shouldExpand = !node.expanded;

  const toggle = (n: RowNode) => {
    n.setExpanded(shouldExpand);
    n.childrenAfterGroup?.forEach(toggle);
  };

  toggle(node);
};