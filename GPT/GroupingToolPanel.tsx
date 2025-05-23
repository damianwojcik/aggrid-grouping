init(params: IToolPanelParams): void {
  this.api = params.api;
  this.eGui = document.createElement('div');
  this.eGui.style.padding = '10px';
  this.eGui.style.display = 'flex';
  this.eGui.style.flexDirection = 'column';

  this.api.addEventListener('gridColumnsChanged', () => this.render());
  this.api.addEventListener('columnRowGroupChanged', () => this.render());

  this.render(); // initial call (may be empty on very early init)
}