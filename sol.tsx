// All params of updateTemporaryView
type UpdateTemporaryViewParams = Parameters<ViewApi['updateTemporaryView']>;

// Remove first param (create)
type UpdateTemporaryViewWithoutCreateParams = UpdateTemporaryViewParams extends [any, ...infer Rest] ? Rest : never;

// The function type without the first param:
type UpdateTemporaryViewWithoutCreate = (...args: UpdateTemporaryViewWithoutCreateParams) => ReturnType<ViewApi['updateTemporaryView']>;