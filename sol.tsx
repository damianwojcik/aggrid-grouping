const toClipboardRow = (params: GetMainMenuItemsParams) => {
  const { node, columnApi } = params;
  if (!node?.data) return '';

  const visibleColumns = columnApi.getAllDisplayedColumns();

  const values = visibleColumns
    .map(col => {
      const field = col.getColDef().field;
      if (!field) return '';
      const value = node.data[field];
      return value ?? ''; // keep empty string for missing values
    });

  // Trim leading/trailing empty cells (AG Grid does this implicitly)
  const start = values.findIndex(v => v !== '');
  const end = values.length - [...values].reverse().findIndex(v => v !== '');
  const trimmed = values.slice(start, end);

  return trimmed.join('\t');
};
