const existingView = id ? getItemById(views, id) : undefined;
const draftView = existingView ?? create(ViewType.ViewTemporary, label, id, parentId);
