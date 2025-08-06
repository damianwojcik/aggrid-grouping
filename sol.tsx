const getClipboardStringFromNode = (params) => {
  const node = params.node;
  if (!node?.data) return '';

  const visibleColumns = params.columnApi.getAllDisplayedColumns();

  return visibleColumns
    .map(col => {
      const field = col.getColDef().field;
      if (!field) return ''; // skip columns without a field
      const value = node.data[field];
      return value != null ? value : ''; // skip undefined/null
    })
    .join('\t');
};


    const text = getClipboardStringFromNode(params);
    navigator.clipboard.writeText(text);