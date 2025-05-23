import type {
  IToolPanelComp,
  IToolPanelParams,
  Column,
  ColumnApi,
  GridApi,
} from 'ag-grid-community';

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;
  private columnApi!: ColumnApi;

  init(params: IToolPanelParams): void {
    this.api = params.api;
    this.columnApi = params.columnApi;

    this.eGui = document.createElement('div');
    this.eGui.style.padding = '10px';
    this.eGui.style.display = 'flex';
    this.eGui.style.flexDirection = 'column';
    this.render();
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(): void {
    this.render(); 
  }

  private render(): void {
    this.eGui.innerHTML = '';

    const allColumns = this.columnApi.getAllColumns() || [];
    const groupableColumns = allColumns.filter(col => {
      const colDef = col.getColDef();
      return colDef.enableRowGroup === true;
    });

    groupableColumns.forEach((col: Column) => {
      const colId = col.getColId();
      const colDef = col.getColDef();
      const isGrouped = this.columnApi.getRowGroupColumns().includes(col);

      const label = document.createElement('label');
      label.style.marginBottom = '6px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isGrouped;

      checkbox.addEventListener('change', () => {
        const currentGroupCols = this.columnApi.getRowGroupColumns();
        if (checkbox.checked) {
          this.columnApi.setRowGroupColumns([...currentGroupCols, col]);
        } else {
          const updated = currentGroupCols.filter(c => c !== col);
          this.columnApi.setRowGroupColumns(updated);
        }
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${colDef.headerName || colId}`));

      this.eGui.appendChild(label);
    });
  }
}
