const onSave = () => {
  // 1. Przywróć tymczasowe widoki do content
  const fullContent = deepClone(content); // NIE mutuj contenta bezpośrednio
  deserialize(fullContent, strippedContent);

  // 2. Usuń je na nowo
  const { strippedContent: newStripped } = serialize(fullContent);

  // 3. Zapisz content bez tymczasowych
  write(fullContent);

  // 4. Zaktualizuj lokalny stan strippedContent
  setStrippedContent(newStripped);
};