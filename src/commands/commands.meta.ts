import * as UserCmds from "./commands-users.js";
import * as FeedCmds from "./commands-feeds.js";
import * as FeedsFollowsCmds from "./commands-feedsfollows.js";
import * as PostCmds from "./commands-posts.js";


/**
 * CLI command metadata:
 * - name: actual CLI command string
 * - args: number of arguments the command expects
 * - handler: function that handles command
 */
export const COMMANDS = {
  RESET: { name: "reset", args: 0, handler: UserCmds.handlerReset },
  USERS: { name: "users", args: 0, handler: UserCmds.handlerUsers },
  REGISTER: { name: "register", args: 1, handler: UserCmds.handlerRegister },
  LOGIN: { name: "login", args: 1, handler: UserCmds.handlerLogin },
  ADDFEED: { name: "addfeed", args: 2, handler: FeedCmds.handlerAddFeed },
  FEEDS: { name: "feeds", args: 0, handler: FeedCmds.handlerFeeds },
  FOLLOW: { name: "follow", args: 1, handler: FeedsFollowsCmds.handlerFollow },
  FOLLOWING: { name: "following", args: 0, handler: FeedsFollowsCmds.handlerFollowing },
  UNFOLLOW: { name: "unfollow", args: 1, handler: FeedsFollowsCmds.handlerUnfollow },
  AGGREGATOR: { name: "agg", args: 1, handler: PostCmds.handlerAggregator },
  BROWSE: { name: "browse", args: 1, handler: PostCmds.handlerBrowse },
} as const;


/**
 * Union type of all object values for keys in COMMANDS:
 * - { readonly name: "reset"; readonly args: 0; readonly handler(cmdName, ...args) } | ... | ... | ...
 */
export type CommandMeta = typeof COMMANDS[keyof typeof COMMANDS];


/**
 * Union type of all valid CLI command names:
 * - "reset" | "users" | "register" | "login"
 */
export type CommandName = CommandMeta["name"];
