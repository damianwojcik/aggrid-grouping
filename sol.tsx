import type { IRowNode } from 'ag-grid-community';

function getGroupingData(node: IRowNode<any>): { field: string; value: string }[] {
  const result: { field: string; value: string }[] = [];

  let currentNode: IRowNode<any> | null = node;

  while (currentNode) {
    if (currentNode.field && currentNode.data) {
      result.push({
        field: currentNode.field,
        value: String(currentNode.data[currentNode.field]),
      });
    }

    // Safe way to check parent
    if (currentNode.parent) {
      currentNode = currentNode.parent;
    } else {
      break; // No more parents
    }
  }

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
