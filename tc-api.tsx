
const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    constructor() {
      super();
    }

    init(params: any) {
      super.init(params);

      setTimeout(() => {
        this.injectCustomRenderer();
      }, 0);
    }

    injectCustomRenderer() {
      const item = this.eGui?.querySelector('[data-col-id="bbgActions"] .ag-column-select-label');
      if (item && !item.querySelector('.my-custom-action')) {
        ReactDOM.render(
          <span className="my-custom-action">
            Text <span style={{ cursor: "pointer" }} onClick={() => alert("Clicked!")}>🔗</span>
          </span>,
          item
        );
      }
    }
  };
};