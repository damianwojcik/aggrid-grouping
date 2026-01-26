type UnwrapZodDefault<T> = T extends z.ZodDefault<infer U> ? U : T;

type BaseViewExtraSchema = UnwrapZodDefault<typeof viewExtraSchema>;

type ResolveViewExtraSchema<T> =
  T extends { customViewExtraSchema: (base: BaseViewExtraSchema) => infer R }
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
        ? customViewExtraSchema(viewExtraSchema._def.innerType)
        : viewExtraSchema._def.innerType) as ResolveViewExtraSchema<T>
    ),
  });
