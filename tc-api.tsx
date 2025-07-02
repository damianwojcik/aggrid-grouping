const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    constructor() {
      super();
    }

    init(params: any) {
      super.init(params);
      setTimeout(() => this.injectCustomRenderer(), 0);

      // Optional: Observe for re-renders
      // const panel = this.eGui?.querySelector('.ag-column-select-panel');
      // if (panel) {
      //   const observer = new MutationObserver(() => this.injectCustomRenderer());
      //   observer.observe(panel, { childList: true, subtree: true });
      // }
    }

injectCustomRenderer() {
  const labels = this.eGui?.querySelectorAll('.ag-column-select-label');
  if (!labels) return;

  // Convert NodeList to Array and find the one with matching text
  const label = Array.from(labels).find(
    el => el.textContent?.trim() === 'bbgActions' && !el.querySelector('.my-custom-action')
  );
  if (label) {
    ReactDOM.render(
      <span className="my-custom-action">
        Text&nbsp;
        <span style={{ cursor: 'pointer' }} onClick={() => alert('Clicked!')}>🔗</span>
      </span>,
      label as Element
    );
  }
}


  };
};