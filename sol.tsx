if (initialImport) {
  const incomingQuerySpecs =
    defaultizedIncomingViewExtra.search.querySpecs;

  defaultizedIncomingViewExtra.search.querySpecs =
    querySpecsWithFilteringSpecsLocked(incomingQuerySpecs, true);

  return defaultizedIncomingViewExtra;
}

const updatedViewExtra =
  defaultizeExtra(existingViewExtra, viewExtraSchema);

const incomingQuerySpecs =
  defaultizedIncomingViewExtra.search.querySpecs;

const existingQuerySpecs =
  updatedViewExtra.search.querySpecs;

// 🔑 merge logic
updatedViewExtra.search.querySpecs = mergeQuerySpecsPreservingSort({
  incoming: incomingQuerySpecs,
  existing: existingQuerySpecs,
});

return updatedViewExtra;

function mergeQuerySpecsPreservingSort({
  incoming:QuerySpecs,
  existing:QuerySpecs,
}): QuerySpecs {
  return Object.fromEntries(
    Object.entries(incoming).map(([name, incomingSpec]) => {
      const existingSpec = existing[name];

      return [
        name,
        {
          ...incomingSpec,
          sortingSpec: existingSpec?.sortingSpec,
          filteringSpec: incomingSpec.filteringSpec?.map(m => ({
            ...m,
            locked: true,
          })),
        },
      ];
    })
  );
}


type MergeQuerySpecsArgs = {
  incoming: QuerySpecs;
  existing: QuerySpecs;
};

function mergeQuerySpecsPreservingSort(
  { incoming, existing }: MergeQuerySpecsArgs
): QuerySpecs {