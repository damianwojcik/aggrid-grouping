import type {
  IToolPanelComp,
  IToolPanelParams,
  GridApi,
  Column,
} from 'ag-grid-community';
import s from './styles.m.less';

export class CustomGroupingToolPanel implements IToolPanelComp {
  private eGui!: HTMLDivElement;
  private api!: GridApi;
  private selectedGroupFields: string[] = [];
  private selectedAggregations: Set<string> = new Set();

  init(params: IToolPanelParams): void {
    this.api = params.api;
    this.eGui = document.createElement('div');
    this.eGui.classList.add(s.wrapper);
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

    const allColumns = this.api.getColumns() || [];
    const groupableColumns = allColumns.filter((col) => {
      const colDef = col.getColDef() as any;
      return colDef.isGroupable === true;
    });

    // === Row Groups Section ===
    const rowGroupSection = document.createElement('div');
    rowGroupSection.classList.add(s.section);

    const rowGroupTitle = document.createElement('div');
    rowGroupTitle.textContent = 'Row Groups';
    rowGroupTitle.classList.add('ag-group-title', s.sectionTitle);
    rowGroupSection.appendChild(rowGroupTitle);

    if (groupableColumns.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = 'No groupable columns available';
      msg.classList.add(s.msgNoColumns);
      rowGroupSection.appendChild(msg);
    } else {
      if (this.selectedGroupFields.length > 0) {
        const orderInfo = document.createElement('div');
        orderInfo.textContent = `Grouping order: ${this.selectedGroupFields.join(' → ')}`;
        orderInfo.classList.add(s.groupOrder);
        rowGroupSection.appendChild(orderInfo);
      }

      groupableColumns.forEach((col: Column) => {
        const colId = col.getColId();
        const colDef = col.getColDef();
        const isChecked = this.selectedGroupFields.includes(colId);
        const isDisabled = !isChecked && this.selectedGroupFields.length >= 3;

        const label = document.createElement('label');
        label.classList.add('ag-label', s.checkboxLabel);

        const wrapper = document.createElement('span');
        wrapper.classList.add('ag-checkbox-input-wrapper');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isChecked;
        checkbox.disabled = isDisabled;
        checkbox.classList.add('ag-input-field-input', 'ag-checkbox');

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            if (this.selectedGroupFields.length < 3) {
              this.selectedGroupFields.push(colId);
            }
          } else {
            this.selectedGroupFields = this.selectedGroupFields.filter((id) => id !== colId);
          }

          this.render();
        });

        wrapper.appendChild(checkbox);
        label.appendChild(wrapper);
        label.appendChild(document.createTextNode(colDef.headerName || colId));
        rowGroupSection.appendChild(label);
      });
    }

    this.eGui.appendChild(rowGroupSection);

    // === Aggregations Section ===
    const aggregationSection = document.createElement('div');
    aggregationSection.classList.add(s.section);

    const aggregationTitle = document.createElement('div');
    aggregationTitle.textContent = 'Aggregations';
    aggregationTitle.classList.add('ag-group-title', s.sectionTitle);
    aggregationSection.appendChild(aggregationTitle);

    const aggOptions = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Gold'];

    aggOptions.forEach((labelText) => {
      const isChecked = this.selectedAggregations.has(labelText);

      const label = document.createElement('label');
      label.classList.add('ag-label', s.checkboxLabel);

      const wrapper = document.createElement('span');
      wrapper.classList.add('ag-checkbox-input-wrapper');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = isChecked;
      checkbox.classList.add('ag-input-field-input', 'ag-checkbox');

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          this.selectedAggregations.add(labelText);
        } else {
          this.selectedAggregations.delete(labelText);
        }

        // You can notify external code here if needed
      });

      wrapper.appendChild(checkbox);
      label.appendChild(wrapper);
      label.appendChild(document.createTextNode(labelText));
      aggregationSection.appendChild(label);
    });

    this.eGui.appendChild(aggregationSection);
  }
}
