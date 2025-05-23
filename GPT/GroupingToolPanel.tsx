import type {
  IToolPanelComp,
  IToolPanelParams,
  Column,
  GridApi,
} from 'ag-grid-community';

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;

  init(params: IToolPanelParams): void {
    this.api = params.api;

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

    const allColumns = this.api.getAllColumns() || [];
    const groupableColumns = allColumns.filter(col => {
      return col.getColDef().enableRowGroup === true;
    });

    if (groupableColumns.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = 'No groupable columns available.';
      msg.style.fontStyle = 'italic';
      msg.style.padding = '8px 0';
      this.eGui.appendChild(msg);
      return;
    }

    const currentGroupCols = this.api.getRowGroupColumns();

    groupableColumns.forEach((col: Column) => {
      const colId = col.getColId();
      const colDef = col.getColDef();
      const isGrouped = currentGroupCols.includes(col);

      const label = document.createElement('label');
      label.style.marginBottom = '6px';
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.gap = '8px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isGrouped;

      checkbox.addEventListener('change', () => {
        const updatedGroupCols = this.api.getRowGroupColumns().filter(c => c !== col);
        if (checkbox.checked) {
          updatedGroupCols.push(col);
        }
        this.api.setRowGroupColumns(updatedGroupCols);
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(colDef.headerName || colId));

      this.eGui.appendChild(label);
    });
  }
}
