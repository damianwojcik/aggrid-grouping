function insertBefore<T>(
  items: T[],
  matcher: (item: T) => boolean,
  newItem: T
): T[] {
  const index = items.findIndex(matcher);
  if (index === -1) return [...items, newItem]; // fallback: append at end
  return [
    ...items.slice(0, index),
    newItem,
    ...items.slice(index),
  ];
}

const menuItems = insertBefore(
  menuItemsDraft,
  (item) => (item as community.MenuItemDef).name === SectionType.Copy,
  copyTicketId[0] // since you’re building [copyTicketId, node]
);


enum SectionType {
  Copy = "Copy",
}

const menuItems = insertBefore(
  menuItemsDraft,
  (item) => (item as any)[Symbol.for("sectionType")] === SectionType.Copy,
  copyTicketId[0]
);
