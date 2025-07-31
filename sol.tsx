// views/src/Views.tsx
import React, { useImperativeHandle, useRef, forwardRef } from 'react';

export type DraftView = {
  id: string;
  label: string;
  extra: Record<string, any>;
};

export type ViewsApi = {
  addTemporaryView: (
    callback: (id: string, label: string, draftView: DraftView) => void
  ) => void;
};

const Views = forwardRef<ViewsApi, {}>((props, ref) => {
  const viewsRef = useRef<DraftView[]>([]);

  useImperativeHandle(ref, () => ({
    addTemporaryView: (callback) => {
      const id = crypto.randomUUID(); // or some ID generator
      const label = 'New view';
      const draftView: DraftView = {
        id,
        label,
        extra: {},
      };

      callback(id, label, draftView);
      viewsRef.current.push(draftView);
    },
  }));

  return (
    <div>
      {/* Render your views here */}
    </div>
  );
});

export default Views;


// panel/src/Panel.tsx
import React, { useRef } from 'react';
import Views, { ViewsApi } from 'views'; // from your views lib

const Panel = () => {
  const viewsRef = useRef<ViewsApi>(null);

  const handleAdd = () => {
    viewsRef.current?.addTemporaryView((id, label, draftView) => {
      draftView.extra.abc = 5;
    });
  };

  return (
    <>
      <button onClick={handleAdd}>Add View</button>
      <Views ref={viewsRef} />
    </>
  );
};

export default Panel;

export { default } from './Views';
export type { ViewsApi, DraftView } from './Views';

viewsRef.current?.addTemporaryView((id, label, draftView) => {
  draftView.extra.abc = 5;
});
