import { z } from "zod";


/* ---------- RSS ITEM ---------- */


/* Defines schema for one <item> element inside <channel>. */
export const RSSItemSchema = z.object({
    title: z.string().min(1, "Item must have a title"),
    link: z.url("Item link must be a valid URL"),
    description: z.string().min(1, "Item must have a description"),
    pubDate: z.string().min(1, "Item must have a pubDate"),
});


/* Validation type for RSSItem. */
export type RSSItem = z.infer<typeof RSSItemSchema>;


/* ---------- RAW CHANNEL ---------- */


/* Defines schema for <channel> element.
 * <item> may be empty, one item, or an array of items. 
 */
export const ChannelSchema = z.object({
    title: z.string().min(1, "Channel must have a title"),
    link: z.url("Channel link must be a valid URL"),
    description: z.string().min(1, "Channel must have a description"),
    item: z.union([
        RSSItemSchema,
        z.array(RSSItemSchema),
    ]).optional(),
});


/* Validation type for RSSChannel. */
export type RSSChannel = z.infer<typeof ChannelSchema>;


/* ---------- RAW FEED ---------- */


/* Defines schema for top-level <rss> element. */
export const RSSFeedSchema = z.object({
    rss: z.object({
        channel: ChannelSchema,
    }),
});


/* Validation type for entire raw rss feed. */
export type RawRSSFeed = z.infer<typeof RSSFeedSchema>;


/* ---------- NORMALIZED FEED ---------- */


/* Defines schema for normalized <channel> element. 
 * <item> gauranteed to be an array.
 */
export const NormalizedRSSFeedSchema = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      link: z.string().url(),
      description: z.string(),
      item: z.array(RSSItemSchema),
    }),
  }),
});


/* Validation type for entire normalized rss feed. */
export type RSSFeed = z.infer<typeof NormalizedRSSFeedSchema>;
