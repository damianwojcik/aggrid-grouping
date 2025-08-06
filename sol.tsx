function hasGrouping(
  view: any
): view is { extra: { grouping: { enabled: boolean } } } {
  return (
    'extra' in view &&
    'grouping' in view.extra &&
    typeof view.extra.grouping?.enabled === 'boolean'
  );
}