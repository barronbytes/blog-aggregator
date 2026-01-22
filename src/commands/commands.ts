/**
 * Reference material:
 * N+1 Problem: https://medium.com/@bvsahane89/understanding-the-n-1-problem-in-rest-api-design-causes-consequences-and-solutions-28d9d3d47860
 */
import type { CommandHandler, CommandRegistry } from "./commands.types.js";
import { fetchFeed } from "../api/rss.js";


// --------------------
// COMMANDS SETUP
// --------------------


/**
 * Adds or updates a command handler to the registry.
 */
export function registerCommand(
    registry: CommandRegistry,
    cmdName: string, 
    handler: CommandHandler
): void {
    registry[cmdName] = handler;
}


/**
 * Runs a command handler from the registry with its arguments.
 * Throws an error if the command does not exist.
 */
export async function runCommand(
    registry: CommandRegistry,
    cmdName: string,
    ...args: string[]
): Promise<void> {
    const handler = registry[cmdName];

    if (!handler) {
        throw new Error(`Error: Failed to provide a "${cmdName}" with a handler function in registry.`);
    }

    await handler(cmdName, ...args);
}


// --------------------
// RSS API
// --------------------


/**
 * Aggregator command: Returns XML object for RSS feed.
 * fetchFeed() handles HTTP, Fetch, Validation, or Unknown errors.
 */
export async function handlerAggregator(cmdName: string, ...args: string[]): Promise<void> {
    const requestURL = "https://www.wagslane.dev/index.xml";
    const rssXML = await fetchFeed(requestURL);

    // Success message
    console.log(JSON.stringify(rssXML, null, 2));
}
