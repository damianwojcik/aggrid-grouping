await storageWrite(async (draft) => {
  // 1. Najpierw zastosuj zmiany z UI
  await combinedUpdater(draft);

  // 2. Przywróć tylko te tymczasowe widoki, które nadal mają sens
  if (strippedContent) {
    const strippedViews = strippedContent.viewsComponent.views;
    const currentIds = new Set(draft.viewsComponent.views.map(v => v.id));

    const stillValid = strippedViews.filter(v => !currentIds.has(v.id));

    deserialize(draft, {
      viewsComponent: {
        views: stillValid
      }
    });
  }

  // 3. Serializuj nowy stan
  const { strippedContent: newStrippedContent } = serialize(draft) ?? {};

  // 4. Zapisz aktualny strippedContent
  setStrippedContent(newStrippedContent);
});