import React from "react";
import ReactDOM from "react-dom";

const ColumnsToolPanel = ColumnToolPanelModule.userComponents?.find(
  (component) => component.name === "agColumnsToolPanel"
)?.classImp as new (...args: any[]) => IToolPanelComp & { eGui?: HTMLElement };

const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    private observer: MutationObserver | null = null;

    constructor(...args: any[]) {
      super(...args);
      this.setupObserver();
      this.injectReactComponent();
    }

    setupObserver() {
      if (!this.eGui) return;
      this.observer = new MutationObserver(() => {
        this.injectReactComponent();
      });
      this.observer.observe(this.eGui, { childList: true, subtree: true });
    }

    injectReactComponent() {
      const labels = this.eGui?.querySelectorAll(".ag-column-select-label");
      if (!labels) return;

      for (const label of labels) {
        if (label.textContent?.includes("bbgActions")) {
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

    destroy() {
      this.observer?.disconnect();
      const labels = this.eGui?.querySelectorAll(".ag-column-select-label");
      if (labels) {
        for (const label of labels) {
          ReactDOM.unmountComponentAtNode(label as Element);
        }
      }
      super.destroy?.();
    }
  };
};