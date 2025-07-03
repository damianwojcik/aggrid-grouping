
export const useSharingMiddleware = ({
  sharedViews,
  prevSharedViews,
  subscriptions,
  setSubscriptions,
  updateSharedItem,
  onError,
}) => {
  // Unique per session/app instance
  const [senderId] = useState(() => uuidv4());

  // Flag to skip effect after remote update
  const skipNextEffect = useRef(false);

  // Listen to STOMP messages for shared views
  const processSharedViews = async () => {
    const sharedViewsIds = sharedViews.map((v) => v.id);
    for (const id of sharedViewsIds) {
      const blobPath = generateMyBlobPathByViewId(id);
      const subscribed = subscriptions.find((s) => s.blobPath === blobPath);
      if (!subscribed) {
        const onMessage = async (incomingView) => {
          const incomingSenderId = incomingView.content?.senderId;
          if (incomingSenderId === senderId) {
            return; // Ignore our own messages
          }
          // Mark the next effect to be skipped (change is from remote)
          skipNextEffect.current = true;
          await modifyState?.(async (draft) => {
            const existingView = getItemById(draft.views, id);
            if (existingView) {
              const changed = isExtraChanged?.(
                existingView.extra,
                incomingView.content?.extra
              );
              if (changed) {
                existingView.extra = incomingView.content?.extra;
              }
              if (incomingView.status === "DELETE") {
                existingView.type = ViewType.Local;
              }
            }
          });
        };
        const unsubscribe = await subscribeView(blobPath, onMessage, onError);
        setSubscriptions((prev) => [
          ...prev,
          { blobPath, unsubscribe },
        ]);
      }
    }
  };

  // Send changes to server, only if not from remote (skip if flag is set)
  const updateSharedViews = async () => {
    if (skipNextEffect.current) {
      skipNextEffect.current = false; // Reset for next change
      return; // Skip syncing to server (change came from remote)
    }
    const sharedViewsIds = sharedViews.map((view) => view.id);
    for (const id of sharedViewsIds) {
      const prevView = prevSharedViews.find((v) => v.id === id);
      const nextView = sharedViews.find((v) => v.id === id);
      const changed =
        prevView &&
        nextView &&
        isExtraChanged?.(prevView.extra, nextView.extra);
      if (changed) {
        await shareItem(id, senderId);
      }
    }
  };

  useEffect(() => {
    processSharedViews();
    updateSharedViews();
    // eslint-disable-next-line
  }, [
    sharedViews,
    prevSharedViews,
    isExtraChanged,
    modifyState,
    updateSharedItem,
    subscriptions,
  ]);
};