const deserialize = (content: ViewsState, removedContent: ViewsState) => {
  const existingIds = new Set(content.viewsComponent.views.map(view => getItemId(view)));

  const viewsToRestore = removedContent.viewsComponent.views.filter(
    view => !existingIds.has(getItemId(view))
  );

  content.viewsComponent.views = [
    ...content.viewsComponent.views,
    ...viewsToRestore
  ];
};