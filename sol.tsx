type MenuItem = string | community.MenuItemDef;


const tagSection = <T extends MenuItem>(item: T, section: SectionType): T => {
  if (typeof item !== "string") {
    (item as any)[SECTION] = section;
  }
  return item;
};

const isInSection = (item: MenuItem, section: SectionType): boolean =>
  typeof item !== "string" && (item as any)?.[SECTION] === section;

// ---- insertion helper ----
const insertBeforeSection = (
  items: MenuItem[],
  section: SectionType,
  newItem: MenuItem
): MenuItem[] => {
  const out: MenuItem[] = [];
  let inserted = false;

  for (const it of items) {
    if (!inserted && isInSection(it, section)) {
      out.push(newItem);
      inserted = true;
    }
    out.push(it);
  }

  if (!inserted) {
    out.push(newItem); // fallback: append at end
  }

  return out;
};


// ---- main hook ----
export const useContextMenuItems = () => {
  const getContextMenuItems = hooks.useDynamicCallback(
    (
      params: community.GetContextMenuItemsParams,
      menuItemsDraft: MenuItem[]
    ): MenuItem[] => {
      const node = params.node;
      const data: BackendRow = node?.data;
      const ticketId = data?.[Field.__TicketId] ?? "";
      const copyTicketIdItem = copyValue("Copy ticket id", ticketId, node);

      // tag built-in "Copy ..." items
      const taggedDraft = menuItemsDraft.map(item =>
        typeof item !== "string" && item.name?.startsWith("Copy")
          ? tagSection(item, SectionType.Copy)
          : item
      );

      return insertBeforeSection(taggedDraft, SectionType.Copy, copyTicketIdItem);
    }
  );

  return getContextMenuItems;
};
