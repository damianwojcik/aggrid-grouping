import {
  IToolPanelComp,
  IToolPanelParams,
  GridApi,
} from "ag-grid-community";
import React from "react";
import ReactDOM from "react-dom";
import { CustomGroupingPanelUI } from "./CustomGroupingPanelUI";

interface AggregationItem {
  id: string;
  name: string;
  func: string;
}

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;

  private groupByFields: string[] = [];
  private activeAggregations: Set<string> = new Set();

  private defaultAggregations: AggregationItem[] = [
    { id: "sizeMM", name: "Size MM", func: "sum" },
  ];

init(params: IToolPanelParams): void {
  this.api = params.api;
  this.eGui = document.createElement("div");

  this.api.addEventListener("gridColumnsChanged", () => this.renderReact());
  this.api.addEventListener("columnRowGroupChanged", () => this.renderReact());

  this.renderReact(); // initial render (may be empty)
}

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(): void {
    this.renderReact();
  }

  destroy(): void {
    ReactDOM.unmountComponentAtNode(this.eGui);
  }

  private renderReact(): void {
    const groupByFields = this.groupByFields;
    const setGroupByFields = (newState: string[]) => {
      this.groupByFields = newState;
      this.renderReact();
    };

    const activeAggregations = this.activeAggregations;
    const setActiveAggregations = (newSet: Set<string>) => {
      this.activeAggregations = newSet;
      this.renderReact();
    };

    const aggregations = this.defaultAggregations;

    const groupableFields = (() => {
      const allColumns = this.api.getColumns() || [];
      return allColumns
        .map((col) => col.getColId())
        .filter((id) => {
          const colDef: any = this.api.getColumn(id)?.getColDef();
          return colDef?.isGroupable === true;
        });
    })();

    ReactDOM.render(
      <CustomGroupingPanelUI
        groupByFields={groupByFields}
        setGroupByFields={setGroupByFields}
        activeAggregations={activeAggregations}
        setActiveAggregations={setActiveAggregations}
        aggregations={aggregations}
        groupableFields={groupableFields}
      />,
      this.eGui
    );
  }
}
