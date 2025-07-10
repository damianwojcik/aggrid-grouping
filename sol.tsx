if (versionGreaterOrEqualThan(contentVersion, '1.20.1')) {
  iterateViews(content, ({ grid }) => {
    const { columnState } = grid.gridState;

    if (!Array.isArray(columnState)) return;

    const index = columnState.findIndex(col => col.colId === 'bbgActions');
    if (index === -1) return;

    const [bbgActionsCol] = columnState.splice(index, 1);
    columnState.splice(1, 0, bbgActionsCol); // indeks 1 = druga kolumna
  });
  return;
}
