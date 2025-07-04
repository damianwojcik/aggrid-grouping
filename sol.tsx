const stompUpdatedViewIdsRef = useRef<Set<string>>(new Set());

const onMessage = async (incomingView: IncomingView) => {
  const incomingSenderId = incomingView.content?.senderId;

  if (incomingSenderId === senderId) {
    return;
  }

  await modifyState?.(async (draft) => {
    const existingView = getItemById(draft.views, id);
    if (existingView) {
      const changed = isExtraChanged?.(existingView.extra, incomingView.content?.extra);
      if (changed) {
        existingView.extra = incomingView.content?.extra;
        stompUpdatedViewIdsRef.current.add(id);
      }
    }
  });
};

const updateSharedViews = async () => {
  const sharedViewsIds = updateSharedViews.map((view) => view.id);

  for (const id of sharedViewsIds) {
    const prevView = prevSharedViews.find((v) => v.id === id);
    const nextView = sharedViews.find((v) => v.id === id);
    const changed = prevView && nextView && isExtraChanged?.(prevView.extra, nextView.extra);

    // Skip if updated by STOMP
    if (stompUpdatedViewIdsRef.current.has(id)) {
      stompUpdatedViewIdsRef.current.delete(id);
      continue;
    }

    if (changed) {
      await shareItem(id);
    }
  }
};
