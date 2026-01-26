
type GetCustomViewExtra<T> =
  T extends { customViewExtraSchema(param: any): infer R }
    ? R extends z.ZodTypeAny
      ? R
      : typeof viewExtraSchema
    : typeof viewExtraSchema;

/* ---------------------------- schema ----------------------------- */

export const createContentSchema = <
  T extends Pick<
    CreateStorageModelOptions<z.ZodTypeAny>,
    'customViewExtraSchema'
  >
>(
  options: T,
) => {
  const extraSchema =
    options.customViewExtraSchema?.(viewExtraSchema) ?? viewExtraSchema;

  return z.object({
    version: z.string(),
    settings: z.object({}),
    viewsComponent: createViewsComponentSchema(extraSchema),
  });
};

/* ----------------------------- model ----------------------------- */

export interface CreateStorageModelOptions<
  T extends z.ZodTypeAny,
> {
  createStorageOptions: <Content extends UnknownRecord>(
    guid: string,
  ) => Pick<
    StorageOptions<Content, Content, Content, Content, Content>,
    'storage'
  >;

  customViewExtraSchema?: (
    baseViewExtraSchema: typeof viewExtraSchema,
  ) => T;
}