import {
  ClientSideRowModelModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  RowSelectionModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowDragModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ],

  defaultColDef: {
    width: 170,
    filter: true,
  },
  rowDragManaged: true,
  rowDragEntireRow: true,

  suppressClickEdit: true,
  suppressNoRowsOverlay: true,
  suppressHorizontalScroll: true,
  suppressMoveWhenRowDragging: true,
  suppressAnimationFrame: true,
  suppressColumnMoveAnimation: true,
  suppressRowTransform: true,
  animateRows: false,

  isRowValidDropPosition: (params) => {
    const valid =
      params.source?.data?.country !== "United States" &&
      params.target?.data?.country !== "United States";

    const gridDiv = document.querySelector<HTMLElement>("#myGrid");
    if (!valid) {
      document.body.classList.add("ag-drag-invalid");
    } else {
      document.body.classList.remove("ag-drag-invalid");
    }

    return valid;
  },
  onRowDragEnd: () => {
    document.body.classList.remove("ag-drag-invalid");

    // const updatedState: IOlympicData[] = [];
    // gridApi.forEachNodeAfterFilterAndSort((node) => {
    //   if (node.data) updatedState.push(node.data);
    // });

    // // update local state
    // await modifyState(async (draft) => {
    //   draft.views = updatedState;
    // });
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));




        body.ag-drag-invalid,
      body.ag-drag-invalid .ag-root,
      body.ag-drag-invalid .ag-row,
      body.ag-drag-invalid .ag-dragging {
        cursor: not-allowed !important;
      }

      body.ag-drag-invalid .ag-dnd-ghost {
        cursor: not-allowed !important;
        visibility: hidden;
      }