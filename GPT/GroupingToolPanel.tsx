import {
  IToolPanelComp,
  IToolPanelParams,
  type ColId,
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

type Group = Pick<ColId, 'colId' | 'headerName'>

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;

  private groupByFields: Group[] = [];
  private activeAggregations: Set<string> = new Set();

  private aggregations: AggregationItem[] = [];

init(params: IToolPanelParams): void {
  this.api = params.api;
  this.eGui = document.createElement("div");
  const ctx = this.api.getContext().context;
  if (ctx?.aggregations) {
    this.aggregations = ctx.aggregations;
  }
  this.api.addEventListener("gridColumnsChanged", () => this.renderReact());
  this.api.addEventListener("columnRowGroupChanged", () => this.renderReact());
  this.renderReact();
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
const setGroupByFields = (newState: Group[]) => {
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
