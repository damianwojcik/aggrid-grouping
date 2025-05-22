"use client";

import React, { useState, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ModuleRegistry,
  GridReadyEvent,
  ColumnApiModule,
  RowStyleModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  TreeDataModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  ValidationModule,
  PivotModule,
} from "ag-grid-enterprise";
import { rawFiles } from "./mock";
import "./style.css";

ModuleRegistry.registerModules([
  ColumnApiModule,
  PivotModule,
  ClientSideRowModelModule,
  TreeDataModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  RowStyleModule,
  ValidationModule,
]);

const columnDefs: ColDef[] = [
  { field: "instrument" },
  { field: "product" },
  { field: "ccy" },
  { field: "startDate" },
  { field: "source" },
  { field: "strategy" },
  { field: "status" },
  { field: "clientSide" },
  { field: "sizeMM", aggFunc: "sum", enableValue: true },
];

const defaultColDef: ColDef = {
  flex: 1,
  enableRowGroup: false,
  enableValue: false,
};

const autoGroupColumnDef = {
  headerName: "Group",
  minWidth: 150,
  cellRendererParams: {
    suppressCount: true,
  },
};

const allGroupableFields = ["strategy", "source", "ccy", "startDate"];

const transformFiles = (files, groupFields: string[]) => {
  return files.map((file) => {
    const groupPrefix = groupFields.map((field) => file[field] || "Unknown");
    return {
      ...file,
      path: [...groupPrefix, ...file.path],
      isPackage:
        file.instrument == null && file.path.length > groupPrefix.length,
    };
  });
};
const GridExample = () => {
  const apiRef = useRef<GridReadyEvent["api"] | null>(null);
  const [groupByFields, setGroupByFields] = useState<string[]>([]);
  const [aggregate, setAggregate] = useState(true);

  const toggleGroupField = (field: string) => {
    setGroupByFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : prev.length < 3
        ? [...prev, field]
        : prev
    );
  };

  const rowData = useMemo(
    () => transformFiles(rawFiles, groupByFields),
    [groupByFields]
  );

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current = params.api;
  };

  const toggleSizeMMAggregation = () => {
    const api = apiRef.current;
    if (!api) return;

    const column = api.getColumn("sizeMM");
    if (!column) return;

    const isValueActive = api.getValueColumns().includes(column);

    if (isValueActive) {
      api.removeValueColumns([column]);
      setAggregate(false);
    } else {
      api.addValueColumns([column]);
      setAggregate(true);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Group by (max 3): </label>
        {allGroupableFields.map((field) => {
          const isChecked = groupByFields.includes(field);
          const disableUnchecked = groupByFields.length >= 3 && !isChecked;

          return (
            <label key={field} style={{ marginLeft: 10 }}>
              <input
                type="checkbox"
                checked={isChecked}
                disabled={disableUnchecked}
                onChange={() => toggleGroupField(field)}
              />
              &nbsp;{field}
            </label>
          );
        })}
      </div>

      {groupByFields.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <strong>Grouping order:</strong> {groupByFields.join(" → ")}
        </div>
      )}

      {/* ✅ New Aggregate row section */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Aggregate: </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={aggregate}
            onChange={toggleSizeMMAggregation}
          />
          &nbsp;Size MM
        </label>
      </div>

      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        groupDefaultExpanded={-1}
        getDataPath={(data) => data.path}
        treeData={true}
        onGridReady={onGridReady}
        getRowClass={(params) => {
          const node = params.node;
          const isChildInPackage =
            node.level > groupByFields.length &&
            node.parent?.childrenAfterGroup?.length > 0;

          return isChildInPackage ? "row-in-package" : "";
        }}
        // @ts-expect-error
        sideBar={{
          toolPanels: [
            {
              id: "columns",
              labelDefault: "Columns",
              iconKey: "columns",
              toolPanel: "agColumnsToolPanel",
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
              },
            },
          ],
          defaultToolPanel: "columns",
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<GridExample />);
