apiRef.current!.setGridOption("doesExternalFilterPass", (node: RowNode) => {
  // Keep a group only if it contains at least one favourite leaf
  if (node.group) {
    return (node.allLeafChildren ?? []).some(
      (leaf) => !!leaf.data?.favourite
    );
  }
  // Leaf: render only favourites
  return !!node.data?.favourite;
});

// after setting/changing the filter:
apiRef.current!.onFilterChanged();