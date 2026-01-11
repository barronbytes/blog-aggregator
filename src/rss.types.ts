import { z } from "zod";


/* Defines schema for one <item> element inside <channel>. */
export const RSSItemSchema = z.object({
    title: z.string().min(1, "Item must have a title"),
    link: z.url("Item link must be a valid URL"),
    description: z.string().min(1, "Item must have a description"),
    pubDate: z.string().min(1, "Item must have a pubDate"),
});


/* Validation type for RSSItem. */
export type RSSItem = z.infer<typeof RSSItemSchema>;


/* Defines schema for <channel> element. */
export const ChannelSchema = z.object({
    title: z.string().min(1, "Channel must have a title"),
    link: z.url("Channel link must be a valid URL"),
    description: z.string().min(1, "Channel must have a description"),
    item: z.array(RSSItemSchema),
});


/* Validation type for RSSChannel. */
export type RSSChannel = z.infer<typeof ChannelSchema>;


/* Defines schema for top-level <rss> element. */
export const RSSFeedSchema = z.object({
    channel: ChannelSchema,
});


/* Validation type for entire rss feed. */
export type RSSFeed = z.infer<typeof RSSFeedSchema>;
