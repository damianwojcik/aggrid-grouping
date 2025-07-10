if (versionGreaterOrEqualThan(contentVersion, '1.20.1')) {
  iterateViews(content, ({ grid }) => {
    const { columnState } = grid.gridState;

    if (!Array.isArray(columnState)) return;

    // Usuń bbgActions i bbgFunctions z tablicy
    const rest = columnState.filter(
      col => col.colId !== 'bbgActions' && col.colId !== 'bbgFunctions'
    );

    const bbgActionsCol = columnState.find(col => col.colId === 'bbgActions');
    const bbgFunctionsCol = columnState.find(col => col.colId === 'bbgFunctions');

    // Wstaw na nowe miejsca: index 2 i 3 (czyli 3. i 4. miejsce)
    const reordered = [
      ...rest.slice(0, 2),           // kolumny 0 i 1
      ...(bbgActionsCol ? [bbgActionsCol] : []), // na 3. miejsce (index 2)
      ...(bbgFunctionsCol ? [bbgFunctionsCol] : []), // na 4. miejsce (index 3)
      ...rest.slice(2)              // reszta kolumn
    ];

    grid.gridState.columnState = reordered;
  });
  return;
}
