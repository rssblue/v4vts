import { validate as uuidValidate } from "uuid";
import { z } from "zod";

const ValueDestinationSchema = z.object({
  name: z.string().nullable().catch(null),

  address: z.string(),
  customKey: z.string().nullable().catch(null),
  customValue: z.string().nullable().catch(null),

  split: z.number(),

  fee: z.boolean().catch(false),
});
const ValueDestinationFieldSchema = z.object({
  destinations: z.array(ValueDestinationSchema),
});
export type ValueDestination = z.infer<typeof ValueDestinationSchema>;

const UrlObjectSchema = z.object({
  url: z.string().url(),
  text: z.string().nullable().catch(null),
});

// Use proper UUID validation because z.string().uuid() does not validate version.
const OptionalUuidSchema = z.string().nullable().refine((value) => {
  if (value === null) {
    return true;
  }
  return uuidValidate(value);
}).catch(null);

const LiveUpdateBlockSchema = z.object({
  title: z.string(),
  link: UrlObjectSchema.nullable().catch(null),
  image: z.string().url().nullable().catch(null),
  description: z.string().nullable().catch(null),
  feedGuid: OptionalUuidSchema,
  itemGuid: z.string().nullable().catch(null),
  value: ValueDestinationFieldSchema.catch({ destinations: [] }),
  blockGuid: OptionalUuidSchema,
});
export type LiveUpdateBlock = z.infer<typeof LiveUpdateBlockSchema>;

export function extractLiveUpdateBlock(data: any): LiveUpdateBlock | null {
  try {
    return LiveUpdateBlockSchema.parse(data);
  } catch (e) {
    return null;
  }
}
