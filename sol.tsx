


export interface CreateStorageModelOptions<
  T extends z.ZodObject<{}>
> {
  createStorageOptions: <Content extends UnknownRecord>(
    guid: string
  ) => Pick<StorageOptions<Content>, 'storage'>;

  customViewExtraSchema?: (
    baseViewExtraSchema: typeof viewExtraSchema
  ) => T;
}


export const createContentSchema = <
  T extends Pick<
    CreateStorageModelOptions<z.ZodObject<{}>>,
    'customViewExtraSchema'
  >,
>({
  customViewExtraSchema,
}: T) => {
  // Value-level narrowing → perfect type inference
  const extraSchema =
    customViewExtraSchema?.(viewExtraSchema) ?? viewExtraSchema;

  return z.object({
    version: z.string(),
    settings: z.object({}),
    viewsComponent: createViewsComponentSchema(extraSchema),
  });
};



export const createStorageModel = <
  T extends CreateStorageModelOptions<z.ZodObject<{}>>
>(
  options: T
) => {
  const schema = createContentSchema(options);

  type Content = z.output<typeof schema>;

  const initialContent: Content = {
    version: '0.0.1',
    settings: {},
    viewsComponent: initialViewsComponentContent,
  };

  return {
    schema,
    initialContent,
    createStorageOptions: options.createStorageOptions,
    cachePolicy: CachePolicy.Persistent,
  };
};
