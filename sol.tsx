// ---- section tagging ----
export enum SectionType {
  Copy = "Copy",
  // add more if needed
}

const SECTION = Symbol("sectionType");

const tagSection = <T extends object>(item: T, section: SectionType): T => {
  (item as any)[SECTION] = section;
  return item;
};

const isInSection = <T extends object>(item: T, section: SectionType): boolean =>
  (item as any)?.[SECTION] === section;

// ---- insertion helper ----
const insertBeforeSection = <T extends object>(
  items: T[],
  section: SectionType,
  newItem: T
): T[] => {
  const out: T[] = [];
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

// ---- copy item factory ----
const copyValue = (
  label: string,
  value: string,
  node: community.IRowNode | null
): community.MenuItemDef => ({
  icon: `<img class="${s.copyToClipboardIcon}" />`,
  name: label,
  action: () => {
    node?.setSelected(true, true);
    copyToClipboard(value ?? "");
    node?.setSelected(false, true);
  },
  disabled: !value,
});

// ---- main hook ----
export const useContextMenuItems = () => {
  const getContextMenuItems = hooks.useDynamicCallback(
    (
      params: community.GetContextMenuItemsParams,
      menuItemsDraft: (string | community.MenuItemDef)[]
    ): (string | community.MenuItemDef)[] => {
      const node = params.node;
      const data: BackendRow = node?.data;
      const ticketId = data?.[Field.__TicketId] ?? "";

      const copyTicketIdItem = copyValue("Copy ticket id", ticketId, node);

      // tag built-in "Copy ..." items as SectionType.Copy
      const taggedDraft = menuItemsDraft.map(item =>
        typeof item !== "string" && item.name?.startsWith("Copy")
          ? tagSection(item, SectionType.Copy)
          : item
      );

      // insert "Copy ticket id" before first Copy section item
      return insertBeforeSection(taggedDraft, SectionType.Copy, copyTicketIdItem);
    }
  );

  return getContextMenuItems;
};
