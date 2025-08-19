const staticSerializeFunctionFromViews = (content: ViewsState) => {
  // Wyodrębnij tymczasowe widoki
  const strippedContent = content.views.filter(view => isTemporaryViewDef(view));
  
  // Usuń tymczasowe widoki z oryginalnego obiektu
  content.views = content.views.filter(view => !isTemporaryViewDef(view));

  // Zwróć to, co zostało usunięte
  return { strippedContent };
};