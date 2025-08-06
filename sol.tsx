const columnDefsWithParams = columnDefs.map((col) =>
  col.field === 'actions'
    ? {
        ...col,
        cellRendererParams: {
          onClick: (rowData) => {
            console.log('Action clicked:', rowData);
          },
        },
      }
    : col
);
