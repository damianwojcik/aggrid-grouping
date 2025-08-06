const existingView = id ? getItemById(temporaryViews, id) : undefined;

const shouldCreateNew =
  !existingView && currentView?.type !== ViewType.ViewTemporary;

const draftView = shouldCreateNew
  ? create(ViewType.ViewTemporary, label, id, parentId)
  : existingView!;