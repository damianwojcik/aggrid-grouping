import { z } from '@ubs.fi.repackaged/zod-4';
import type { UnknownRecord } from '@ubs.fi.lib/type-utils';
import { CachePolicy, type StorageOptions } from '@ubs.fi/storage';
import { viewExtraSchema } from './extraSchema';
import {
  createViewsComponentSchema,
  initialViewsComponentContent,
} from './viewsComponentSchema';

/* ---------------------------- helpers ---------------------------- */

type UnwrapDefault<T extends z.ZodTypeAny> =
  T extends z.ZodDefault<infer U> ? U : T;

type GetContentWithCustomViewExtra<T> =
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
>({
  customViewExtraSchema,
}: T) =>
  z.object({
    version: z.string(),
    settings: z.object({}),
    viewsComponent: createViewsComponentSchema(
      (customViewExtraSchema?.(viewExtraSchema) ??
        viewExtraSchema) as GetContentWithCustomViewExtra<T>
    ),
  });

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

export const createStorageModel = <
  T extends CreateStorageModelOptions<z.ZodTypeAny>,
>(
  options: T,
) => {
  const schema = createContentSchema<T>(options);

  type Content = z.output<typeof schema>;

  const initialContent: Content = {
    version: '0.0.1',
    settings: {},
    viewsComponent: initialViewsComponentContent,
  };

  return {
    schema,
    initialContent,
  };
};
