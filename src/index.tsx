"use client";

import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  TreeDataModule,
  FiltersToolPanelModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { rawFiles } from "./mock";
import "./style.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  RowGroupingModule,
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
  headerName: "File Explorer",
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
    };
  });
};

const GridExample = () => {
  const [groupByFields, setGroupByFields] = useState<string[]>([]);

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

  return (
    <div className="container">
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Group by (max 3): </label>
        {allGroupableFields.map((field) => (
          <label key={field} style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={groupByFields.includes(field)}
              onChange={() => toggleGroupField(field)}
            />
            &nbsp;{field}
          </label>
        ))}
      </div>

      {groupByFields.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <strong>Grouping order:</strong> {groupByFields.join(" → ")}
        </div>
      )}

      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        groupDefaultExpanded={-1}
        getDataPath={(data) => data.path}
        treeData={true}
        sideBar={{
          toolPanels: [
            {
              id: "columns",
              labelDefault: "Columns",
              iconKey: "columns",
              toolPanel: "agColumnsToolPanel",
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
