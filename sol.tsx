const index = viewsComponentsDraft.views.findIndex(v => v.id === draftView.id);

if (index === -1) {
  viewsComponentsDraft.views.unshift(draftView);
} else {
  viewsComponentsDraft.views[index] = draftView;
}