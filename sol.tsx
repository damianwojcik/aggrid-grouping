const sortDefaultFirst = (views: View[]) =>
  views.sort((a, b) => Number(isDefaultViewDef(b)) - Number(isDefaultViewDef(a)));

const remainingViews = allViews.filter(view => !isTemporaryViewDef(view));
sortDefaultFirst(remainingViews);