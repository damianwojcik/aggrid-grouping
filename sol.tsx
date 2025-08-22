const deserialize = (content: ViewsState, removedContent: ViewsState) => {
  const currentIds = new Set(
    content.viewsComponent.views.map((v) => getItemId(v))
  );

  const strippedIds = new Set(
    removedContent.viewsComponent.views.map((v) => getItemId(v))
  );

  // final result: przywróć tylko te, które:
  // - są w removedContent
  // - nie są już w stanie (czyli nie zostały usunięte w UI)
  const toRestore = removedContent.viewsComponent.views.filter(
    (v) => {
      const id = getItemId(v);
      return !currentIds.has(id) && strippedIds.has(id);
    }
  );

  content.viewsComponent.views = [
    ...content.viewsComponent.views,
    ...toRestore
  ].filter(
    (v, i, arr) => i === arr.findIndex((x) => getItemId(x) === getItemId(v))
  );
};
