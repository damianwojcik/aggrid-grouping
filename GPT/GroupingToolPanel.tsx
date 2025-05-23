import React, { useImperativeHandle, forwardRef } from 'react';
import { IToolPanel, IToolPanelParams } from 'ag-grid-community';
import { IToolPanelReactComp } from 'ag-grid-react';

// The visible part: your React functional UI
const GroupingToolPanelUI: React.FC = () => {
  return (
    <div style={{ padding: 10 }}>
      <h3>Grouping Panel</h3>
      <p>This is a custom grouping panel.</p>
    </div>
  );
};

// The AG Grid-compatible wrapper with imperative handle
export const GroupingToolPanel = forwardRef<IToolPanel, IToolPanelParams>((props, ref) => {
  // Required lifecycle method(s)
  useImperativeHandle(ref, () => ({
    refresh: () => {
      return true;
    }
  }));

  return <GroupingToolPanelUI />;
});
