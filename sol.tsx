import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useSharingMiddleware = ({
  sharedViews,
  prevSharedViews,
  isExtraChanged,
  modifyState,
  shareItem,
  subscribeView,
  setSubscriptions,
  getItemById,
  senderId,
  subscriptions,
  generateMyBlobPathByViewId,
  ViewType,
}) => {
  // Track updateIds per view
  const sentUpdateIds = useRef<Map<string, Set<string>>>(new Map());

  const syncSharedViewTwoWay = () => {
    if (equal(sharedViews, prevSharedViews)) {
      return;
    }

    const processSharedViews = async () => {
      const sharedViewsIds = sharedViews.map((v) => v.id);

      for (const id of sharedViewsIds) {
        const blobPath = generateMyBlobPathByViewId(id);
        const subscribed = subscriptions.find((s) => s.blobPath === blobPath);

        if (!subscribed) {
          const onMessage = async (incomingView: IncomingView) => {
            const incomingUpdateId = incomingView.content?.updateId;
            // Check if we have sent this updateId for this view
            if (sentUpdateIds.current.get(id)?.has(incomingUpdateId)) {
              sentUpdateIds.current.get(id)?.delete(incomingUpdateId); // Clean up
              return; // Ignore our own echo!
            }
            const incomingSenderId = incomingView.content?.senderId;
            if (incomingSenderId === senderId) return; // Optional: for legacy support

            await modifyState?.((draft) => {
              const existingView = getItemById(draft.views, id);
              if (existingView) {
                const changed = isExtraChanged?.((existingView as ViewDef).extra, incomingView.content?.extra);
                if (changed) {
                  (existingView as ViewDef).extra = incomingView.content?.extra;
                }
                if (incomingView.status === 'DELETE') {
                  existingView.type = ViewType.Local;
                }
              }
            });
          };

          const onError = (e) => { /* handle error */ };
          const unsubscribe = await subscribeView(blobPath, onMessage, onError);
          setSubscriptions((prev) => [...prev, { blobPath, unsubscribe }]);
        }
      }
    };

    const updateSharedViews = async () => {
      const sharedViewsIds = sharedViews.map((view) => view.id);

      for (const id of sharedViewsIds) {
        const prevView = prevSharedViews.find((v) => v.id === id);
        const nextView = sharedViews.find((v) => v.id === id);
        const changed = prevView && nextView && isExtraChanged?.(prevView.extra, nextView.extra);
        if (changed) {
          const updateId = uuidv4();
          if (!sentUpdateIds.current.has(id)) {
            sentUpdateIds.current.set(id, new Set());
          }
          sentUpdateIds.current.get(id)!.add(updateId);
          await shareItem(id, updateId); // Ensure BE broadcasts updateId in STOMP!
          // Cleanup after 10s
          setTimeout(() => sentUpdateIds.current.get(id)?.delete(updateId), 10000);
        }
      }
    };

    processSharedViews();
    updateSharedViews();
  };

  useEffect(syncSharedViewTwoWay, [sharedViews, prevSharedViews, isExtraChanged, modifyState, shareItem]);
};