const onceRowDataUpdated = (api: GridApi): Promise<void> =>
  new Promise(resolve => {
    const handler = () => {
      api.removeEventListener('rowDataUpdated', handler);
      resolve();
    };
    api.addEventListener('rowDataUpdated', handler);
  });


  const onSaveClick = async () => {
  const id = itemId;
  await modifyState(...);

  await onceRowDataUpdated(api);

  const node = api.getRowNode(id);
  if (node) {
    api.ensureIndexVisible(node.rowIndex!);
    api.startEditingCell({ rowIndex: node.rowIndex!, colKey: 'label' });
  }
};
