import React from "react";
import ReactDOM from "react-dom";

const ColumnsToolPanel = ColumnToolPanelModule.userComponents?.find(
  (component) => component.name === "agColumnsToolPanel"
)?.classImp as new (...args: any[]) => IToolPanelComp & { eGui?: HTMLElement };

const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    constructor(...args: any[]) {
      super(...args);
      this.injectReactComponent();
    }

    // This will be called by AG Grid whenever the Tool Panel needs to refresh
    refresh() {
      super.refresh?.(); // Call base class refresh just in case
      this.injectReactComponent();
      return true; // AG Grid expects a boolean
    }

    injectReactComponent() {
      const labels = this.eGui?.querySelectorAll(".ag-column-select-label");
      if (!labels) return;

      for (const label of labels) {
        if (label.textContent?.includes("bbgActions")) {
          // Clean up previous renders to avoid duplicate React trees
          ReactDOM.unmountComponentAtNode(label as Element);
          label.textContent = ""; // Or keep the text if you want
          ReactDOM.render(
            <span className="my-custom-action">
              Text <span style={{ cursor: "pointer" }} onClick={() => alert("Clicked!")}>🔗</span>
            </span>,
            label as Element
          );
          break;
        }
      }
    }
  };
};