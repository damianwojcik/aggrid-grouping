type ResolveViewExtraSchema<T> =
  T extends { customViewExtraSchema: (base: typeof viewExtraSchema) => infer R }
    ? R
    : typeof viewExtraSchema;

export const createContentSchema = <
  T extends Pick<CreateStorageModelOptions<z.ZodObject<{}>>, 'customViewExtraSchema'>
>({
  customViewExtraSchema,
}: T) =>
  z.object({
    version: z.string(),
    settings: z.object({}),
    viewsComponent: createViewsComponentSchema(
      (customViewExtraSchema
        ? customViewExtraSchema(viewExtraSchema)
        : viewExtraSchema) as ResolveViewExtraSchema<T>
    ),
  });
