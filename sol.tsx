const draftViewId = draftView.path.at(-1);

const updatedTemporaryViews = temporaryViews.some(
  v => v.path.at(-1) === draftViewId
)
  ? temporaryViews.map(v =>
      v.path.at(-1) === draftViewId ? draftView : v
    )
  : [...temporaryViews, draftView];

store.set(temporaryViewsAtom, updatedTemporaryViews);
