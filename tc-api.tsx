import type { ICellRendererComp, ICellRendererParams } from 'ag-grid-community';

export class ButtonRenderer implements ICellRendererComp {
  private eGui!: HTMLElement;
  private lastDataLength: number = 0;

  init(params: ICellRendererParams & { context: any }): void {
    this.eGui = document.createElement('div');

    const ref = params.context?.storageRef;
    if (ref) {
      ref.notify = () => {
        const data = ref.current?.content ?? [];
        if (data.length !== this.lastDataLength) {
          this.lastDataLength = data.length;
          this.renderButtons(data);
        }
      };
    }

    const data: any[] = ref?.current?.content ?? [];
    this.lastDataLength = data.length;
    this.renderButtons(data);
  }
}
