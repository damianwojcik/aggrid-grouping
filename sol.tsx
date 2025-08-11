    init(params: any) {
      super.init(params);
      this.extensions = params.toolPanelParams?.extensions;
      this.getSelectedViewType = params.toolPanelParams?.getSelectedViewType;
    }
