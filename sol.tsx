export const useSidebar = (extensions: any, selectedViewType: ViewType): SideBarDef => {
  console.log('!!! sidebar', { selectedViewType });

  const ColumnToolPanel = createCustomToolPanel(extensions, selectedViewType);

  // Function to refresh the tool panel
  const refreshToolPanel = () => {
    // Directly return the updated sidebar configuration with new tool panel
    return {
      sideBar: {
        toolPanels: [ColumnToolPanel],
      },
    };
  };

  useEffect(() => {
    // Trigger refresh every time selectedViewType changes
    refreshToolPanel(); // Refresh the sidebar tool panel with the new state
  }, [selectedViewType]); // Dependency array ensures it runs on changes

  return refreshToolPanel(); // Return updated sidebar configuration
};
