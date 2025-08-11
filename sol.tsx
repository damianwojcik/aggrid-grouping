export const useSidebar = (extensions: any, selectedViewType: ViewType): SideBarDef => {
  console.log('!!! sidebar', { selectedViewType });

  const ColumnToolPanel = createCustomToolPanel(extensions, selectedViewType);

  // Function to refresh the tool panel
  const refreshToolPanel = () => {
    return {
      toolPanels: [ColumnToolPanel],
    };
  };

  // Side bar definition
  const sideBarDef = {
    // Other properties you might want to include in the sidebar
    sideBar: {
      ...refreshToolPanel(), // Add tool panels to sideBar configuration
      // Include other configurations, e.g., default tool panels, visibility, etc.
    },
    // You may have other properties for the sidebar or other components
  };

  useEffect(() => {
    // Whenever selectedViewType changes, you may want to trigger any side effect
    refreshToolPanel(); // This will update the tool panels when selectedViewType changes
  }, [selectedViewType]);

  return sideBarDef; // Return the full sidebar definition with toolPanels
};
