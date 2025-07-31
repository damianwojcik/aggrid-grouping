const Views = forwardRef<ViewsApi, Props>(({ }, ref) => {
  const viewsRef = useRef<DraftView[]>([]);
  const store = useStore();

  // ✅ Any store setup before api is created
  const somethingAtom = atom(0);

  // Example: set initial value or handler
  useEffect(() => {
    store.set(somethingAtom, 42);

    // you can also set handlers here if needed
    // store.set(handlerAtom, () => ...)

  }, [store]); // runs once

  // ✅ Now store is ready – safe to create API
  const api = useViewsApi(viewsRef, store);

  useImperativeHandle(ref, () => api);

  return <div>{/* render */}</div>;
});


function useViewsApi(
  viewsRef: React.RefObject<DraftView[]>,
  store: ReturnType<typeof useStore>
): ViewsApi {
  return {
    updateTemporaryView: ({ id, label, parentId }, update) => {
      const resolvedId = id ?? crypto.randomUUID();
      let draftView = viewsRef.current!.find(v => v.id === resolvedId);

      if (!draftView) {
        draftView = {
          id: resolvedId,
          label: label ?? 'Untitled',
          parentId,
          extra: {},
        };
        viewsRef.current!.push(draftView);
      } else {
        if (label) draftView.label = label;
        if (parentId) draftView.parentId = parentId;
      }

      if (update) {
        void update(draftView);
      }

      // ✅ Access Jotai values here too
      const someVal = store.get(somethingAtom);

      return resolvedId;
    },
  };
}
