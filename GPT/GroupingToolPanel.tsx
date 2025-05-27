import { IToolPanelComp, IToolPanelParams, GridApi } from "ag-grid-community";
import { createRoot, Root } from "react-dom/client";
import React from "react";
import { CustomGroupingPanelUI } from "./CustomGroupingToolPanelUI";

interface AggregationItem {
  id: string;
  name: string;
  func: string;
}

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private root!: Root;
  private api!: GridApi;

  private groupByFields: string[] = [];
  private activeAggregations: Set<string> = new Set();

  // get from ag grid context?
  private aggregations: AggregationItem[] = [
    { id: "sizeMM", name: "Size MM", func: "sum" },
  ];

  init(params: IToolPanelParams): void {
    this.api = params.api;
    this.eGui = document.createElement("div");
    this.root = createRoot(this.eGui);
    this.renderReact();
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(): void {
    this.renderReact();
  }

  private renderReact(): void {
    const setGroupByFields = (newState: string[]) => {
      this.groupByFields = newState;
      this.renderReact();
    };

    const activeAggregations = this.activeAggregations;
    const setActiveAggregations = (newSet: Set<string>) => {
      this.activeAggregations = newSet;
      this.renderReact();
    };

    const groupableFields = (() => {
      const allColumns = this.api.getColumns() || [];
      return allColumns
        .map((col) => col.getColId())
        .filter((id) => {
          const colDef: any = this.api.getColumn(id)?.getColDef();
          return colDef?.isGroupable === true;
        });
    })();

    this.root.render(
      <CustomGroupingPanelUI
        groupByFields={this.groupByFields}
        setGroupByFields={setGroupByFields}
        activeAggregations={activeAggregations}
        setActiveAggregations={setActiveAggregations}
        aggregations={this.aggregations}
        groupableFields={groupableFields}
      />
    );
  }
}
