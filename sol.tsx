const getContextMenuItems = hooks.useDynamicCallback(
  (params: community.GetContextMenuItemsParams): ReturnType<community.GetContextMenuItems> => {
    const node = params.node;
    const data: BackendRow = node?.data;
    const ticketId = data?.[Field.__TicketId] ?? '';
    const copyTicketId = [copyValue('Copy ticket id', ticketId, node)];

    const draft = params.menuItems as (string | community.MenuItemDef)[];

    // Find the first "Copy" section
    const copyIdx = draft.findIndex(
      (it) => typeof it !== 'string' && (it as community.MenuItemDef).sectionType === community.SectionType.Copy
    );

    // Insert our item before that section (or append if not found)
    if (copyIdx >= 0) {
      return [
        ...draft.slice(0, copyIdx),
        ...copyTicketId,
        ...draft.slice(copyIdx),
      ];
    }
    return [...draft, ...copyTicketId];
  }
);

return { getContextMenuItems };
