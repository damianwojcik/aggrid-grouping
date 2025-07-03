const lastUpdateSource = useRef<'local' | 'remote' | null>(null);

const syncSharedViewTwoWay = () => {
  // ... other logic
  const processSharedViews = async () => {
    // inside onMessage (when you get a STOMP message)
    const onMessage = async (incomingView: IncomingView) => {
      if (incomingSenderId === senderId) return;
      lastUpdateSource.current = 'remote';
      await modifyState?.(draft => {
        // ... update state
      });
    };
    // ...
  };

  const updateSharedViews = async () => {
    if (lastUpdateSource.current === 'remote') {
      lastUpdateSource.current = null; // reset for next time
      return; // skip broadcast, since this was a remote change
    }
    lastUpdateSource.current = 'local';
    // ... normal broadcast logic
    await shareItem(id);
  };

  processSharedViews();
  updateSharedViews();
};

useEffect(syncSharedViewTwoWay, [sharedViews, prevSharedViews, ...]);