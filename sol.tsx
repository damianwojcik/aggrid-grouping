/**
 * Creates or updates a temporary view inside the `viewsComponent`.
 *
 * - If `id` is provided and matches a temporary view, it updates that view.
 * - If no matching view is found and `selectedView?.type !== ViewType.ViewTemporary`, a new temporary view is created.
 * - The provided `update` callback can mutate the `draftView` before saving.
 * - Automatically sets `label`, `parentId`, `path`, and clones `extra` from `selectedView` when appropriate.
 * - Disables grouping if the view has grouping enabled.
 *
 * @param {Object} viewInfo - Info about the view to create or update.
 * @param {string} [viewInfo.id] - ID of the view to update. If not provided, a new ID will be generated.
 * @param {string} [viewInfo.label] - Label of the view.
 * @param {string} [viewInfo.parentId] - Optional parent view ID to define the view's path.
 * @param {ViewType} [viewInfo.type=ViewType.ViewTemporary] - Type of the view to create (defaults to `ViewTemporary`).
 *
 * @param {(draftView: StrictViewContent) => Promise<void>} [update] - Optional async callback to modify the draft view before saving.
 *
 * @returns {Promise<string>} Resolves with the ID of the created or updated view.
 *
 * @throws Will reject the promise if the view cannot be found or created.
 */