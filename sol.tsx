// ---- section enum ----
export enum ContextMenuItemsSection {
  Copy = "Copy",
  Export = "Export",
  // add more if needed
}

type MenuItem = string | (community.MenuItemDef & { contextMenuItemSection?: ContextMenuItemsSection });

// ---- insertion helper ----
const insertBeforeSection = (
  items: MenuItem[],
  section: ContextMenuItemsSection,
  newItem: MenuItem
): MenuItem[] => {
  const out: MenuItem[] = [];
  let inserted = false;

  for (const it of items) {
    if (!inserted && typeof it !== "string" && it.contextMenuItemSection === section) {
      out.push(newItem);
      inserted = true;
    }
    out.push(it);
  }

  if (!inserted) {
    out.push(newItem); // fallback at end
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

      // here you can tag draft items you control
      // e.g. if you add "Copy cell" yourself:
      // menuItemsDraft.push({ name: "Copy cell", ..., contextMenuItemSection: ContextMenuItemsSection.Copy });

      // insert Copy Ticket Id before Copy section
      return insertBeforeSection(menuItemsDraft, ContextMenuItemsSection.Copy, copyTicketIdItem);
    }
  );

  return getContextMenuItems;
};
