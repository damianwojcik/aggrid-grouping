updateTemporaryView(
  viewInfo: { id?: string; label?: string; parentId?: string },
  update?: (draftView: DraftView) => Promise<void>
): string