function myCellRenderer(params) {
  const eDiv = document.createElement('div');
  eDiv.innerText = `${params.value} (${params.label})`;

  eDiv.addEventListener('click', () => {
    // update some external state/context that affects the label
    params.context.dynamicLabel = 'Clicked';

    // trigger re-render
    params.api.refreshCells({
      rowNodes: [params.node],
      columns: [params.column.getColId()],
      force: true
    });
  });

  return eDiv;
}
