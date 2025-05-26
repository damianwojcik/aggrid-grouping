"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  ModuleRegistry,
  GridReadyEvent,
  ColumnApiModule,
  RowStyleModule,
  EventApiModule,
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
import { CustomGroupingToolPanel } from "./CustomGroupingToolPanel";
import "./style.css";

ModuleRegistry.registerModules([
  ColumnApiModule,
  PivotModule,
  ClientSideRowModelModule,
  TreeDataModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  EventApiModule,
  RowGroupingModule,
  RowStyleModule,
  ValidationModule,
]);

interface ExtendedColDef extends ColDef {
  isGroupable?: boolean;
}

const columnDefs: ExtendedColDef[] = [
  { field: "instrument", isGroupable: true },
  { field: "product", isGroupable: true },
  { field: "ccy" },
  { field: "startDate" },
  { field: "source", isGroupable: true },
  { field: "strategy" },
  { field: "status" },
  { field: "clientSide", isGroupable: true },
  { field: "sizeMM" },
  { field: "alpha", isGroupable: true },
  { field: "beta", isGroupable: true },
  { field: "gamma", isGroupable: true },
  { field: "delta", isGroupable: true },
  { field: "fox", isGroupable: true },
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

const aggregations = [
  {
    id: "agg-size-mm",
    name: "Size MM",
    func: "sum",
  },
  {
    id: "avg",
    name: "AVG",
    func: "average",
  },
];

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
  const [activeAggregations, setActiveAggregations] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const payload = {
      groupBy: groupByFields,
      aggregations: aggregations
        .filter((agg) => activeAggregations.has(agg.id))
        .map(({ id, func }) => ({ id, func })),
    };

    console.log(
      "Generated REST query payload:",
      JSON.stringify(payload, null, 2)
    );
  }, [groupByFields, activeAggregations]);

  const rowData = useMemo(
    () => transformFiles(rawFiles, groupByFields),
    [groupByFields]
  );

  const onGridReady = (params: GridReadyEvent) => {
    apiRef.current = params.api;
  };

  return (
    <div className="container">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        components={{
          CustomGroupingToolPanel,
        }}
        groupDefaultExpanded={-1}
        getDataPath={(data) => data.path}
        treeData={true}
        onGridReady={onGridReady}
        // @ts-expect-error
        sideBar={{
          hiddenByDefault: false,
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
            {
              id: "grouping",
              labelKey: "grouping",
              labelDefault: "Grouping",
              iconKey: "group",
              toolPanel: "CustomGroupingToolPanel",
              toolPanelParams: {
                groupByFields,
                setGroupByFields,
                aggregations,
                activeAggregations,
                setActiveAggregations,
              },
            },
          ],
          defaultToolPanel: "grouping",
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<GridExample />);
