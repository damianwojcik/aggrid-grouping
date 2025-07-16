init(params: ICellRendererParams & { context: any }): void {
  this.eGui = document.createElement('div');

  const ref = params.context?.storageRef;

  // Create the render function for this cell
  const render = () => {
    const data = ref.current?.content ?? [];

    if (data.length !== this.lastDataLength) {
      this.lastDataLength = data.length;
      this.render(data);
    }
  };

  // ✅ Register in notify list
  ref?.notifyList.add(render);

  // ✅ Store the cleanup function (to remove it later)
  this.cleanup = () => {
    ref?.notifyList.delete(render);
  };

  // Initial render
  render();
}