const onColumnRowGroupChanged = (params: ColumnRowGroupChangedEvent) => {
  const allCols = params.columnApi.getAllGridColumns();

  const autoGroupCol = allCols.find(col => col.getColId()?.includes('auto_group'));
  const actionsCol = allCols.find(col => col.getColId() === 'actions');

  if (autoGroupCol && actionsCol) {
    const autoGroupIndex = allCols.indexOf(autoGroupCol);
    params.columnApi.moveColumn(actionsCol.getColId(), autoGroupIndex + 1);
  }
};