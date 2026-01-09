/* 
* Full RSS feed for top-level <rss> XML element.
*/
type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};


/* 
* One <item> element inside <channel>.
*/
type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};
