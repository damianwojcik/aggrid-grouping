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

  private aggregations: AggregationItem[] = [
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
    const setGroupByFields = (newState: string[]) => {
      this.groupByFields = newState;
      this.renderReact();
    };

    const setActiveAggregations = (newSet: Set<string>) => {
      this.activeAggregations = newSet;
      this.renderReact();
    };

    const allColumns = this.api.getColumns() || [];

    const groupableFields = allColumns
      .filter((col) => {
        const colDef: any = col.getColDef();
        return colDef?.isGroupable === true;
      })
      .map((col) => ({
        colId: col.getColId(),
        headerName: col.getColDef().headerName || col.getColId(),
      }));


    ReactDOM.render(
      <CustomGroupingPanelUI
        groupByFields={this.groupByFields}
        setGroupByFields={setGroupByFields}
        activeAggregations={this.activeAggregations}
        setActiveAggregations={setActiveAggregations}
        aggregations={this.aggregations}
        groupableFields={groupableFields}
      />,
      this.eGui
    );
  }
}
