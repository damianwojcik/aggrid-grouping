React question STOMP + REST. I have App that have Views. Each of the View can have search filter Pills. Views can be shared so other people can Import and sync with them. When I share a View, when I make changes to Pills - I update data on the server


export const useSharingMiddleware = () => {
  const syncSharedViewTwoWay = () => {
    if (equal(sharedViews, prevSharedViews)) {
      return;
    }

    const processSharedViews = async() => {
      const sharedViewsIds = updateSharedViews.map((v) => v.id)

      for (const id of sharedViewsIds) {
        const blobPath = generateMyBlobPathByViewId(id);
        const subscribed = subscriptions.find((s) => s.blobPath === blobPath);

        if (!subscribed) {
          const onMessage = async (incomingView: IncomingView) => {
            const incomingSenderId = incomingView.content?.senderId;

            if (incomingSenderId === senderId) {
              return;
            }

            // modifyState is function that modified persisted state by POST request to /storage
            await modifyState?.(async(draft) => {
              const existingView = getItemById(draft.views,id);

              if (existingView) {
                const changed = isExtraChanged?.((existingView as ViewDef).extra, incomingView.content?.extra);

                if (changed) {
                  (existingView as ViewDef).extra = incomingView.content?.extra;
                }
                if (incomingView.status === 'DELETE') {
                  existingView.type = ViewType.Local; // not Shared anymore
                }
              }
            });

            const unsubscribe = await subscribeView(blobPath, onMessage, onError);
            setSubscriptions((prevSubscriptions) => [...prevSubscriptions, {path: blobPath, unsubscribe}])
          }
        }
      }
    }

    const updateSharedViews = async() => {
      const sharedViewsIds = updateSharedViews.map((view) => view.id);

      for (const id of sharedViewsIds) {
        const prevView = prevSharedViews.find((v) => v.id === id);
        const nextView = sharedViews.find((v) => v.id === id);
        const changed = prevView && nextView && isExtraChanged?.(prevView.extra, nextView.extra);
        if (changed) {
          await shareItem(id); // POST request to /shared API, after which BE triggers sending message to all listeners of that View
        }
      }
    }

    processSharedViews();
    updateSharedViews();
  }

  useEffect(syncSharedViewTwoWay, [sharedViews, prevSharedViews, isExtraChanged, modifyState, updateSharedItem]);
}

Above code works fine. I created a View, shared it, then added few Pills, removed them.

Problem starts when I launch second instance of the same App. Now If I quickly add or remove 2 pills, then both of my App instances gets into infinite loop of adding/removing one of the pills.

I think problem is somewhere around senderId? Please help