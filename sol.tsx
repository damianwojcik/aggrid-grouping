  console.log('AFTER combinedUpdater', draft.viewsComponent.views.map(getItemId));

  if (strippedContent) {
    deserialize(draft, strippedContent);
    console.log('AFTER deserialize', draft.viewsComponent.views.map(getItemId));
  }

  const { strippedContent: newStrippedContent } = serialize(draft) ?? {};
  console.log('NEW strippedContent', newStrippedContent.viewsComponent.views.map(getItemId));