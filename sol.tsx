  const values = visibleColumns
    .map(col => {
      const field = col.getColDef().field;
      if (!field) return undefined;
      return node.data[field] ?? '';
    })
    .filter(value => value !== undefined); // skip columns without field

  return values.join('\t');