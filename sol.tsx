const serialize = (content: ViewsState): { removedContent: ViewsState } => {
  const allViews = content.viewsComponent.views;
  const removedViews = allViews.filter(view => isTemporaryViewDef(view));
  const remainingViews = allViews.filter(view => !isTemporaryViewDef(view));

  content.viewsComponent.views = remainingViews;

  return {
    removedContent: {
      viewsComponent: {
        views: removedViews
      }
    }
  };
};


const deserialize = (content: ViewsState, removedContent: ViewsState) => {
  content.viewsComponent.views = [
    ...content.viewsComponent.views,
    ...removedContent.viewsComponent.views
  ];
};
