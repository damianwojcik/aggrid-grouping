 useEffect(() => {
    if (!apiRef.current) return;

    apiRef.current.isExternalFilterPresent = () => !cond;

    apiRef.current.doesExternalFilterPass = (node: RowNode) => {
      if (cond) return true; // filtering disabled

      if (node.group) {
        return (node.allLeafChildren ?? []).some(
          leaf => !!leaf.data?.item?.data
        );
      }
      return !!node.data?.item?.data;
    };

    apiRef.current.onFilterChanged(); // trigger re-run
  }, [cond]);