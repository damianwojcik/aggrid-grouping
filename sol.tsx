const lastUpdateSource = useRef<'local' | 'remote'>('local');

const onStompMessage = async (incomingView) => {
  lastUpdateSource.current = 'remote';
  await modifyState(...); // update local state from STOMP
};

const syncSharedViewTwoWay = () => {
  if (lastUpdateSource.current === 'remote') {
    lastUpdateSource.current = 'local'; // Reset
    return; // Don't fire REST POST, avoid echo loop
  }
  // ... your regular REST POST logic ...
};