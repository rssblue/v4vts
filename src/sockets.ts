import * as yup from "yup";
import { validate as uuidValidate } from "uuid";

const ValueDestinationSchema = yup.object({
  name: yup.string().nullable().default(null),

  address: yup.string().required(),
  customKey: yup.string().nullable().default(null),
  customValue: yup.string().nullable().default(null),

  split: yup.number().required(),

  fee: yup.boolean().default(false),
});
const ValueDestinationFieldSchema = yup.object({
  destinations: yup.array().of(ValueDestinationSchema).required(),
});
export type ValueDestination = yup.InferType<typeof ValueDestinationSchema>;

const UrlObjectSchema = yup.object({
  url: yup.string().url().required(),
  text: yup.string().nullable().default(null),
})

const OptionalUuidSchema = yup.string().transform((value) => {
  return uuidValidate(value) ? value : null;
}).nullable().default(null);

const LiveUpdateBlockSchema = yup.object({
  title: yup.string().required(),
  link: UrlObjectSchema.transform((value) => {
    if (UrlObjectSchema.isValidSync(value)) {
      return UrlObjectSchema.cast(value, { stripUnknown: true });
    }

    return undefined;
  }).nullable().default(null),
  image: yup.string().nullable().default(null),
  description: yup.string().nullable().default(null),
  feedGuid: OptionalUuidSchema,
  itemGuid: yup.string().nullable().default(null),
  value: ValueDestinationFieldSchema.transform((value) => {
    if (ValueDestinationFieldSchema.isValidSync(value)) {
      return ValueDestinationFieldSchema.cast(value, { stripUnknown: true });
    }

    return undefined;
  }).default({ destinations: [] }),
  blockGuid: OptionalUuidSchema,
});
export type LiveUpdateBlock = yup.InferType<typeof LiveUpdateBlockSchema>;

export function extractLiveUpdateBlock(data: any): LiveUpdateBlock | null {
  if (LiveUpdateBlockSchema.isValidSync(data)) {
    return LiveUpdateBlockSchema.cast(data, { stripUnknown: true });
  }

  return null;
}
