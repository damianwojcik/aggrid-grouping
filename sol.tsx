const updateTemporaryView: UpdateTemporaryView = async (
  { id, label, parentId, type = ViewType.ViewTemporary },
  update
) => {
  // generate once, outside; used only if we create
  const ensuredId = id ?? crypto.randomUUID();
  let resultId: string | undefined;

  await updateViewsComponent((viewsComponentDraft) => {
    const temporaryViews = viewsComponentDraft.views.filter(isTemporaryViewDef);
    const isDefaultView = type === ViewType.ViewDefault;

    const existingView = id
      ? getItemById(temporaryViews, id) // make sure to pass `id`
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
          ensuredId,      // use the precomputed id only when creating
          parentId
        )
      : { ...existingView, ...update, label, parentId, type };

    if (shouldCreateNew) {
      viewsComponentDraft.views.unshift(draftView);
      resultId = ensuredId;                // created → return ensuredId
    } else {
      const idx = viewsComponentDraft.views.findIndex(
        (v) => getItemId(v) === getItemId(existingView)
      );
      if (idx !== -1) viewsComponentDraft.views[idx] = draftView;
      resultId = getItemId(existingView);  // reused → keep existing id
    }
  });

  return resultId!;
};
