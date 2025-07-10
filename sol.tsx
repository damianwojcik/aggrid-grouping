if (versionGreaterOrEqualThan(contentVersion, '1.20.1')) {
  iterateViews(content, ({ grid }) => {
    const { columnState } = grid.gridState;

    if (!Array.isArray(columnState)) return;

    // Usuń obie kolumny, jeśli istnieją
    const bbgActionsIndex = columnState.findIndex(col => col.colId === 'bbgActions');
    const bbgFunctionsIndex = columnState.findIndex(col => col.colId === 'bbgFunctions');

    const bbgActionsCol = bbgActionsIndex !== -1 ? columnState.splice(bbgActionsIndex, 1)[0] : null;
    const bbgFunctionsIndexAdjusted = bbgFunctionsIndex !== -1
      ? (bbgFunctionsIndex > bbgActionsIndex ? bbgFunctionsIndex - 1 : bbgFunctionsIndex)
      : -1;
    const bbgFunctionsCol = bbgFunctionsIndexAdjusted !== -1 ? columnState.splice(bbgFunctionsIndexAdjusted, 1)[0] : null;

    // Najpierw wstaw kolumnę o wyższym indeksie docelowym!
    if (bbgFunctionsCol) columnState.splice(3, 0, bbgFunctionsCol); // index 3 = 4. pozycja
    if (bbgActionsCol) columnState.splice(2, 0, bbgActionsCol);     // index 2 = 3. pozycja
  });
  return;
}
