updateTemporaryView(
  viewInfo: { id?: string; label?: string; parentId?: string },
  update?: (draftView: DraftView) => Promise<void>
): string

 useImperativeHandle(ref, () => ({
    updateTemporaryView: ({ id, label, parentId }, update) => {
      const resolvedId = id ?? crypto.randomUUID();
      let draftView = viewsRef.current.find(v => v.id === resolvedId);

      if (!draftView) {
        draftView = {
          id: resolvedId,
          label: label ?? 'Untitled',
          parentId,
          extra: {},
        };
        viewsRef.current.push(draftView);
      } else {
        if (label) draftView.label = label;
        if (parentId) draftView.parentId = parentId;
      }

      if (update) {
        // Fire and forget – caller handles the Promise if needed
        void update(draftView);
      }

      return resolvedId;
    },
  }));

  viewsRef.current?.updateTemporaryView(
  { label: 'My New View' },
  async (draftView) => {
    draftView.extra.abc = 5;
  }
);