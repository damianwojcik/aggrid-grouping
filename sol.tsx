import { z } from '@ubs.fi.repackaged/zod-4';

/* base */

export const viewExtraSchema = z.object({}).default({});

/* helpers */

type ResolveViewExtraSchema<T> =
  T extends { customViewExtraSchema: (base: typeof viewExtraSchema) => infer R }
    ? R
    : typeof viewExtraSchema;

/* factories */

export const createViewsComponentSchema = <
  TExtra extends z.ZodType<unknown>
>(
  viewExtraSchema: TExtra
) =>
  z.object({
    extra: viewExtraSchema,
  });

export const createContentSchema = <
  T extends {
    customViewExtraSchema?: <S extends typeof viewExtraSchema>(
      base: S
    ) => z.ZodType<unknown>;
  }
>(
  options: T
) => {
  const resolvedViewExtraSchema =
    options.customViewExtraSchema?.(viewExtraSchema) ?? viewExtraSchema;

  return z.object({
    viewsComponent: createViewsComponentSchema(resolvedViewExtraSchema),
  });
};
