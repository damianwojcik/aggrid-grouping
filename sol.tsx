if (versionGreaterOrEqualThan(contentVersion, '1.20.1')) {
  iterateViews(content, ({ grid }) => {
    const { columnState } = grid.gridState;

    if (!Array.isArray(columnState)) return;

    // Usuń obie kolumny (jeśli istnieją)
    const bbgActionsIndex = columnState.findIndex(col => col.colId === 'bbgActions');
    const bbgFunctionsIndex = columnState.findIndex(col => col.colId === 'bbgFunctions');

    const bbgActionsCol = bbgActionsIndex !== -1 ? columnState.splice(bbgActionsIndex, 1)[0] : null;
    // UWAGA: po usunięciu jednej kolumny, indeks drugiej może się zmienić
    const bbgFunctionsCol = bbgFunctionsIndex !== -1
      ? columnState.splice(
          bbgFunctionsIndex > bbgActionsIndex ? bbgFunctionsIndex - 1 : bbgFunctionsIndex,
          1
        )[0]
      : null;

    // Wstaw na właściwe pozycje
    if (bbgFunctionsCol) columnState.splice(2, 0, bbgFunctionsCol); // 3. miejsce (indeks 2)
    if (bbgActionsCol) columnState.splice(1, 0, bbgActionsCol);     // 2. miejsce (indeks 1)
  });
  return;
}
