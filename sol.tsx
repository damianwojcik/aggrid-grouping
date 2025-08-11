export const useSidebar = (extensions: any, selectedViewType: ViewType): SideBarDef => {
  console.log('!!! sidebar', {selectedViewType}); // selectedViewType changes
  
  const ColumnToolPanel = createCustomToolPanel(extensions, selectedViewType); 

  // Trigger a refresh when selectedViewType changes
  const api = extensions.gridOptions.api;
  const refreshToolPanel = () => {
    const toolPanelInstance = api.getToolPanelInstance('columns'); // Assuming 'columns' is your tool panel ID
    if (toolPanelInstance) {
      toolPanelInstance.refresh(); // Trigger refresh of the tool panel
    }
  };

  useEffect(() => {
    refreshToolPanel(); // Call refresh every time selectedViewType changes
  }, [selectedViewType]); // Dependency array ensures it runs on changes

  return {
    // Your sidebar code here
  };
};