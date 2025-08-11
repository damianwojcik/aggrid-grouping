// build the side bar def whenever deps change
const sideBar = useMemo<SideBarDef>(() => ({
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      toolPanel: createCustomToolPanel(), // no captured state here
      toolPanelParams: {
        extensions,
        getSelectedViewType: () => selectedViewType, // <-- live getter
      },
    },
  ],
}), [extensions, selectedViewType]);

// pass sideBar to <AgGridReact sideBar={sideBar} />



const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    private getSelectedViewType!: () => ViewType;
    private extensions!: any;

    // AG Grid calls init on tool panels
    public init(params: any) {
      super.init(params);
      this.extensions = params.toolPanelParams.extensions;
      this.getSelectedViewType = params.toolPanelParams.getSelectedViewType;
    }

    public refresh() {
      const type = this.getSelectedViewType();
      // update UI based on latest type
      // ...
      return true; // per AG Grid contract
    }
  };
};













// whatever gives you the current view type
const viewType = currentView?.type; // 'view-temporary' | 'view-normal' | ...

return (
  <div className="app" data-view-type={viewType}>
    <Toolbar>
      <button className="btn-toggle">Toggle</button>
      <button className="btn-apply-all">Apply to all views</button>
      {/* ...rest */}
    </Toolbar>
    {/* rest of app */}
  </div>
);


/* Hide entirely when view is temporary */
[data-view-type="view-temporary"] .btn-toggle,
[data-view-type="view-temporary"] .btn-apply-all {
  display: none;
}

/* If you prefer to keep layout space but disable interaction: */
/*
[data-view-type="view-temporary"] .btn-toggle,
[data-view-type="view-temporary"] .btn-apply-all {
  visibility: hidden;
  pointer-events: none;
}
*/


<div className={s.app} data-view-type={viewType}>
  <button className={s.toggleBtn}>Toggle</button>
  <button className={s.applyAllBtn}>Apply to all views</button>
</div>


/* App.module.css */
[data-view-type="view-temporary"] .toggleBtn,
[data-view-type="view-temporary"] .applyAllBtn {
  display: none;
}


document.querySelector('[data-view-type="view-temporary"]')
