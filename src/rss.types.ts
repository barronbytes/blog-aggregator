/**
 * Reference material:
 * Basics: https://zod.dev/basics
 * Defining schemas: https://zod.dev/api
 * Custom Error messages: https://zod.dev/error-customization
 */
import { z } from "zod";


/* ---------- RSS ITEM ---------- */


/* Defines schema for one <item> element inside <channel>. */
export const ItemSchema = z.object({
    title: z.string().min(1, "Item must have a title"),
    link: z.url("Item link must be a valid URL"),
    description: z.string().min(1, "Item must have a description"),
    pubDate: z.string().min(1, "Item must have a pubDate"),
});


/* Validation type for RSSItem. */
export type RSSItem = z.infer<typeof ItemSchema>;


/* ---------- RAW CHANNEL ---------- */


/* Defines schema for <channel> element.
 * <item> may be empty, one item, or an array of items. 
 */
export const ChannelSchema = z.object({
    title: z.string().min(1, "Channel must have a title"),
    link: z.url("Channel link must be a valid URL"),
    description: z.string().min(1, "Channel must have a description"),
    item: z.union([
        ItemSchema,
        z.array(ItemSchema),
    ]).optional(),
});


/* Validation type for RSSChannel. */
export type RSSChannel = z.infer<typeof ChannelSchema>;


/* ---------- RAW FEED ---------- */


/* Defines schema for top-level <rss> element. */
export const RawFeedSchema = z.object({
    rss: z.object({
        channel: ChannelSchema,
    }),
});


/* Validation type for entire raw rss feed. */
export type RSSRawFeed = z.infer<typeof RawFeedSchema>;


/* ---------- NORMALIZED FEED ---------- */


/* Defines schema for normalized <channel> element. 
 * <item> gauranteed to be an array.
 */
export const NormalizedFeedSchema = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      link: z.url(),
      description: z.string(),
      item: z.array(ItemSchema),
    }),
  }),
});


/* Validation type for entire normalized rss feed. */
export type RSSFeed = z.infer<typeof NormalizedFeedSchema>;
