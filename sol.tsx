const views = useMemo(() => {
  return [...storageViews, ...temporaryViews].map(view => ({ ...view }));
}, [storageViews, temporaryViews]);
