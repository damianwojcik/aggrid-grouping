function getGroupingData(node: IRowNode<any>): { field: string; value: string }[] {
  const result: { field: string; value: string }[] = [];

  let currentNode: IRowNode<any> | null = node;

  while (currentNode) {
    const { field, data } = currentNode;

    if (field && data) {
      const rawValue = data[field];

      // Only include if value is not null, undefined, or empty string
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
        result.push({
          field,
          value: String(rawValue),
        });
      }
    }

    currentNode = currentNode.parent ?? null;
  }

  return result.reverse();
}