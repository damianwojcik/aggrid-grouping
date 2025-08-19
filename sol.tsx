const staticSerializeFunctionFromViews = (content: ViewsState) => {
  const strippedContent: typeof content.views = [];

  // Mutate in-place: go backwards and remove matching items
  for (let i = content.views.length - 1; i >= 0; i--) {
    const view = content.views[i];
    if (isTemporaryViewDef(view)) {
      strippedContent.push(view);
      content.views.splice(i, 1); // this is the actual mutation
    }
  }

  return { strippedContent };
};
