import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class ButtonRenderer implements ICellRendererComp {
  private eGui!: HTMLElement;
  private lastDataLength: number = 0;
  private cleanup?: () => void;

  init(params: ICellRendererParams & { context: any }): void {
    this.eGui = document.createElement('div');

    const ref = params.context?.storageRef;

    const render = () => {
      const data = ref.current?.content ?? [];

      if (data.length !== this.lastDataLength) {
        this.lastDataLength = data.length;
        this.render(data);
      }
    };

    // Subscribe this instance
    ref?.notifyList.add(render);

    // Save unsubscribe logic for later
    this.cleanup = () => {
      ref?.notifyList.delete(render);
    };

    // Initial render
    render();
  }

  refresh(): boolean {
    return true; // prevent AG Grid from destroying/replacing the DOM
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  destroy(): void {
    this.cleanup?.(); // Unsubscribe from notify list
  }

  private render(data: any[]): void {
    this.eGui.innerHTML = '';

    data.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.innerText = item.label || `Button ${index + 1}`;
      btn.addEventListener('click', () => {
        alert(`Clicked: ${item.id}`);
      });
      this.eGui.appendChild(btn);
    });
  }
}
