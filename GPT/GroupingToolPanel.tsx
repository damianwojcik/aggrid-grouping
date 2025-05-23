import React, { useImperativeHandle, forwardRef } from 'react';
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { IToolPanelReactComp } from 'ag-grid-react';


export class GroupingToolPanel extends React.Component<{}, {}> implements IToolPanel {
  refresh(): boolean {
    return true;
  }
  
  render() {
    return (
    <div>
      <h3>Grouping Panel</h3>
      <p>This is your custom grouping panel.</p>
    </div>
    );
  }
}