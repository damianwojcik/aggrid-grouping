
import s from './styles.m.less'

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;

  init(params: IToolPanelParams): void {
    this.api = params. api;
    this.eGui = document.createElement('div');
    this.eGui.classList.add(s.wrapper);
    this.api.addEventListener('gridColumnsChanged', ()=> this.render())
    this.api.addEventListener('columnRowGroupChanged', ()=> this.render());
    this.render();
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    this.eGui.innerHTML = ''; // is that needed?

    const allColumns = this.api.getColumns() || [];
    const groupableColumns = allColumns.filter((col) => {
      const colDef = col.getColDef() as worker.ColDefWithExtra;
      return colDef.isGroupable === true;
    })

    if (groupableColumns.length === 0) {
      const msg = document.createElement('div');
      msg.classList.add(s.msgNoColumns);
      msg.textContent = 'No groupable columns available';
      this.eGui.appendChild(msg);
      return;
    }

    // can't use below, because my grid id treeData={true}!
    const currentGroupCols = this.api.getRowGroupColumns(); // this is wrong! we should have own internal state instead of using ag grid rowGroup state!

    // better use .map than forEach!
    groupableColumns.forEach((col: Column) => {
      const colId = col.getColId();
      const colDef = col.getColDef();
      const isGrouped = currentGroupCols.includes(col);

      const label = document.createElement('label');
      label.classList.add(s.label);

      const checkbox = document.createElement('checkbox');
      checkbox.checked = isGrouped;

      checkbox.addEventListener('change', () => {
        const updatedGroupCols = this.api.getRowGroupColumns().filter((c) => c !== col);
        if(checkbox.checked) {
          updatedGroupCols.push(col)
        }
        this.api.setRowGroupColumns(updatedGroupCols);
      })

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(colDef.headerName || colId))

      this.eGui.appendChild(label);
    })
  }
}