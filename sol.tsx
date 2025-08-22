const deserialize = (content: ViewsState, removedContent: ViewsState) => {
  const existingIds = new Set(
    content.viewsComponent.views.map((v) => getItemId(v))
  );

  const filtered = removedContent.viewsComponent.views.filter(
    (v) => !existingIds.has(getItemId(v))
  );

  content.viewsComponent.views = [
    ...content.viewsComponent.views,
    ...filtered
  ].filter(
    (v, i, arr) => i === arr.findIndex((x) => getItemId(x) === getItemId(v))
  );
};
