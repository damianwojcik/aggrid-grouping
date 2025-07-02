const ColumnsToolPanel = ColumnToolPanelModule.userComponents?.find(
  (component) => component.name === 'agColumnsToolPanel'
)?.classImp as new (...args: any[]) => IToolPanelComp & { eGui?: HTMLElement };

const createCustomToolPanel = () => {
  return class CustomToolPanel extends ColumnsToolPanel {
    constructor() {
      super();
    }

    // Override this method if possible (it may vary depending on AG Grid version)
    // This is a rough sketch; you may need to adjust based on your AG Grid version
    createColumnItem(column: any) {
      // Call base implementation for other columns
      if (column.colDef && column.colDef.field === 'bbgActions') {
        // Create your custom element
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        // Text
        const text = document.createElement('span');
        text.innerText = column.colDef.headerName || column.colDef.field;
        container.appendChild(text);

        // Clickable icon
        const icon = document.createElement('span');
        icon.innerHTML = '🔗'; // Replace with your preferred icon (SVG, etc)
        icon.style.cursor = 'pointer';
        icon.style.marginLeft = '8px';
        icon.onclick = () => {
          // Your custom logic here
          alert('Icon clicked for bbgActions!');
        };
        container.appendChild(icon);

        return container;
      } else {
        // Fallback to default behavior
        return super.createColumnItem(column);
      }
    }
  };
};