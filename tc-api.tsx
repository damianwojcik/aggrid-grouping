import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class ButtonRenderer implements ICellRendererComp {
  private eGui!: HTMLElement;
  // We’ll cache a stable reference (here, just the length) so we render only if that changes.
  private lastDataLength: number = 0;

  init(params: ICellRendererParams): void {
    this.eGui = document.createElement('div');
    // Suppose the BE data is passed in as params.cellRendererParams.data (an array)
    const data: any[] = params.cellRendererParams?.data ?? [];
    this.lastDataLength = data.length;
    this.renderButtons(params, data);
  }

  refresh(params: ICellRendererParams): boolean {
    // Retrieve the fetched data from cellRendererParams
    const newData: any[] = params.cellRendererParams?.data ?? [];
    const newLength = newData.length;

    // Only update the DOM if the length has changed.
    // (You might also compare other stable properties if needed.)
    if (newLength !== this.lastDataLength) {
      this.lastDataLength = newLength;
      this.renderButtons(params, newData);
    }
    return true;
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  destroy(): void {
    // If you attached any event listeners or timers outside
    // of the returned eGui, clean them up here.
    // (In this simple case, nothing extra is needed.)
  }

  private renderButtons(params: ICellRendererParams, data: any[]): void {
    // Clear the container
    this.eGui.innerHTML = '';

    // For each item in the fetched data, create a button.
    data.forEach((item, index) => {
      const btn = document.createElement('button');
      // For example, suppose each item has a "label" property.
      btn.innerText = item.label || `Button ${index + 1}`;
      btn.addEventListener('click', () => {
        // Handle click as needed—for example, alert the item ID.
        alert(`Clicked: ${item.id}`);
      });
      this.eGui.appendChild(btn);
    });
  }
}







const columnDefs = useMemo(() => [
  {
    field: 'actions',
    cellRenderer: ButtonRenderer,
    // WARNING: Make sure you pass a stable reference!
    cellRendererParams: { data: fetchedData }
  }
], [fetchedData]);








refresh(params: ICellRendererParams): boolean {
  const newData: any[] = params.cellRendererParams?.data ?? [];
  const newLength = newData.length;
  
  console.log('Refresh called: new length =', newLength, 'cached length =', this.lastDataLength);
  
  if (newLength !== this.lastDataLength) {
    console.log('Data length changed, re-rendering buttons.');
    this.lastDataLength = newLength;
    this.renderButtons(params, newData);
  }
  return true;
}
