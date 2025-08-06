const rows: string[] = [];
params.api.forEachNodeAfterFilterAndSort((node) => {
  const values = params.columnApi.getAllDisplayedColumns()
    .map(col => {
      const field = col.getColDef().field;
      if (!field) return '';
      return node.data?.[field] ?? '';
    });
  rows.push(values.join('\t'));
});
console.log(rows.join('\n'));