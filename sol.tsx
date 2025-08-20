const updateTemporaryView: UpdateTemporaryView = async (
  { id, label, parentId, type = ViewType.ViewTemporary },
  update
) => {
  const ensuredId = id ?? crypto.randomUUID();

  return new Promise<string>((resolve) => {
    updateViewsComponent((viewsComponentDraft) => {
      const temporaryViews = viewsComponentDraft.views.filter(isTemporaryViewDef);
      const isDefaultView = type === ViewType.ViewDefault;

      const existingView = id
        ? getItemById(temporaryViews, id)
        : isDefaultView
        ? undefined
        : selectedView
        ? findParentViewBtItemId(temporaryViews, getItemId(selectedView))
        : undefined;

      const shouldCreateNew = !existingView;

      const draftView = shouldCreateNew
        ? createDefaultStrictView(
            type,
            label ?? TEMPORARY_VIEW_LABEL,
            ensuredId,
            parentId
          )
        : { ...existingView, ...update, label, parentId, type };

      if (shouldCreateNew) {
        viewsComponentDraft.views.unshift(draftView);
      } else {
        const idx = viewsComponentDraft.views.findIndex(
          (v) => getItemId(v) === getItemId(existingView)
        );
        if (idx !== -1) viewsComponentDraft.views[idx] = draftView;
      }

      // resolve right here
      resolve(getItemId(draftView) ?? ensuredId);
    });
  });
};
