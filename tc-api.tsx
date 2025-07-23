const setGroupingMode = useCallback((groupingMode: boolean) => {
  if (!fnRef.current) {
    console.warn('updateSelectedView is not yet available');
    return;
  }
  fnRef.current(groupingMode);
}, []);