  onColumnRowGroupChanged={onColumnRowGroupChanged}

  const onColumnRowGroupChanged = useCallback((params: ColumnRowGroupChangedEvent) => {
  const autoGroupCol = params.columnApi.getAllGridColumns().find(col => col.getColId()?.includes('auto_group'));
  if (autoGroupCol) {
    params.columnApi.moveColumn(autoGroupCol, 0);
  }
}, []);