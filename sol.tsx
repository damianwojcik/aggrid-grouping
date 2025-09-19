const insertBeforeSection = (
  items: MenuItem[],
  section: ContextMenuItemsSection,
  newItem: MenuItem
): MenuItem[] => {
  const idx = items.findIndex(
    it => typeof it !== "string" && it.contextMenuItemSection === section
  );
  if (idx === -1) return [...items, newItem]; // fallback: append if no match
  return [...items.slice(0, idx), newItem, ...items.slice(idx)];
};