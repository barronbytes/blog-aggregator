/**
 * Reference material:
 * N+1 Problem: https://medium.com/@bvsahane89/understanding-the-n-1-problem-in-rest-api-design-causes-consequences-and-solutions-28d9d3d47860
 */
import type { CommandHandler, CommandRegistry } from "./commands.types.js";
import { updateUsername, readConfig } from "./file-handling.js";
import { User, createUser, getUsers, getUserByName, getUserByID, resetTable } from "./db-users-queries.js";
import { Feed, createFeed, getFeeds, getFeedByUrl, getFeedNameById } from "./db-feeds-queries.js";
import { createFeedFollow, getFeedFollow, getFollowedFeedIds } from "./db-feeds-follows-queries.js";
import { fetchFeed } from "./rss.js";


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
// COMMANDS
// --------------------


/**
 * Register command: Creates user and sets the username in the config JSON file.
 * Throws an error if user is already registered.
 */
export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    // Set username from args
    const username = args[0];

    // Exit program if user previously registered
    const existingUser = await getUserByName(username);
    if (existingUser) {
        throw new Error(`Error: User "${username}" already exists.`);
    }

    // Create new user and set user in the config
    const newUser = await createUser(username);
    updateUsername(username);

    // Success messages
    console.log("New user data: ", newUser);
    console.log(`User "${username}" has been registered and set as the current user.`);
}


/*
* Login command: Sets the username in the config JSON file.
* Throws an error if user is not registered.
*/
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    // Set username from args
    const username = args[0];

    // Exit program if user not registered
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`Error: User "${username}" does not exist.`);
    }

    // Set current user in the config
    updateUsername(username);

    // Success message
    console.log(`User "${username}" has been set as the current user.`);
}


/**
 * Users command: Selects all users in the users table.
 * Throws an error if no users in users table.
 */
export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    // Selects all users from the users table
    const allUsers = await getUsers();

    // Exit program if no users
    if (allUsers.length === 0) {
        throw new Error("Error: No users.");
    }

    // Selects current username
    const currentUserName = readConfig().currentUserName;

    // Success message
    const output = allUsers.map(user => {
        const marker = user.name === currentUserName ? " (current)" : "";
        return `* ${user.name}${marker}`;
    }).join("\n");
    console.log(output);
}


/**
 * Reset command: Deletes all users from the users table.
 */
export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    // Deletes all rows from users table.
    await resetTable();

    // Success message
    console.log("Users table reset successfully.");
}

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


/**
 * Feeds command: Selects all feeds from the feeds table.
 */
export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
    // Selects all feeds from the feeds table
    const allFeeds = await getFeeds();
    const output: string[] = [];

    // FLAG: N+1 database query problem
    for (const feed of allFeeds) {
        const user = await getUserByID(feed.userId);
        const username = user ? user.name : "(unknown)";
        output.push(`* Feed name: ${feed.name}, Feed url: ${feed.url}, User: ${username}`);
    }

    // Success message
    console.log(output.join("\n"));
}


/**
 * addfeed command: Creates feed record in feeds table and entry in feedsfollows table.
 * Throws an error if cannot create feed.
 */
export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    // Get table record values to pass
    const [name, url] = args;

    // Get current user from config
    const username = readConfig().currentUserName;

    // Exit program if user not registered
    const user = await getUserByName(username);
    if (!user) {
        throw new Error(`Error: User "${username}" does not exist.`);
    }

    // Create feed linked to user
    const feed = await createFeed(
        name,
        url,
        user.id,
    );

    // Create feed linked to user
    const feedFollow = await createFeedFollow(
        feed.id,
        user.id,
    );

    // Success message
    console.log("Feed added successfully:");
    printFeed(feed, user);
}


/* Helper function to print user and feed information */
export function printFeed(feed: Feed, user: User): void {
    console.log("Feed:", JSON.stringify(feed, null, 2));
    console.log("User:", JSON.stringify(user, null, 2));
}


/**
 * follow command: Creates joint table record in feeds_follows table.
 * Throws an error if cannot add record.
 */
export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    // Get feed and user name from command-line input and config file, respectively
    const feedUrl = args[0];
    const userName = readConfig().currentUserName;

    // Exit program if feed not registered
    const feed = await getFeedByUrl(feedUrl);
    const user = await getUserByName(userName) as User;
    if (!feed) {
        throw new Error(`Error: Feed "${feedUrl}" does not exist.`);
    }

    // Exit program if entry with feed.id and user.id already exists in feeds_follows table
    const existsFeedFollow = await getFeedFollow(feed.id, user.id);
    if (existsFeedFollow) {
        console.log(`User "${user.name}" already follows "${feed.name}".`);
        return;
    }

    // Create feed linked to user
    const feedFollow = await createFeedFollow(
        feed.id,
        user.id,
    );

    // Success message
    console.log("User followed feed successfully:");
    console.log(`Feed: ${feed.name}, User: ${user.name}`);
}


/**
 * following command: Returns feed names the current user follows in the feeds_follows table.
 * Returns an empty array if no feeds are followed.
 */
export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
    // Use current username to retrieve current user id
    const userName = readConfig().currentUserName;
    const user = await getUserByName(userName) as User;

    // Get feed IDs user follows
    const feedIds = await getFollowedFeedIds(user.id);

    // Normalize feed names per field id
    const feedNames = (await Promise.all(
        feedIds.map(feedId => getFeedNameById(feedId))
    )).filter((name): name is string => Boolean(name));

    // Success message
    console.log(`Feeds followed: ${feedNames.join(", ")}`);
}
