function getGroupingData(node: any): { field: string; value: any }[] {
  const result: { field: string; value: any }[] = [];

  let currentNode = node;
  while (currentNode) {
    if (currentNode.field) {
      result.push({
        field: currentNode.field,
        value: currentNode.data?.[currentNode.field],
      });
    }
    currentNode = currentNode.parent;
  }

  // Reverse so that the top-most parent is first
  return result.reverse();
}

{
  name: 'View Data',
  action: () => {
    const MY_DATA = getGroupingData(node);

    const groupingMatchers = MY_DATA.map((item) =>
      createMatcher({
        operator: 'and',
        comparison: groupingComparisonOperator,
        field: item.field,
        value: item.value,
        test: String(item.value),
      })
    );

    console.log(groupingMatchers);
  }
}
