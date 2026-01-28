# Blog Aggregator

CLI-based application for fetching data from any RSS feed. User commands trigger TypeScript functions that execute PostgreSQL operations and return user, feed, follow, and post data as terminal output.

![This app downloads RSS items for any RSS feed.](./public/project-banner-image.png)

## Tech Stack

* **Frontend:** None (CLI-based application)
* **Backend:** TypeScript, PostgreSQL
* **Runtime:** Node.js
* **Tooling:** npm, Drizzle, Zod

## Project Structure

```
blog-aggregator/
├── public/                 # Media assets
├── data/
│   ├── configs/            # Stores PostgreSQL connection and user information
│   ├── generated/          # Auto-generated SQL by drizzle for full table definitions
│   ├── migrations/         # Programmer-created SQL for incremental table changes
│   └── schemas/            # Database table schema definitions
├── node_modules/
├── src/
│   ├── api/                # RSS request/response typing and validation for HTTP fetch() calls
│   ├── commands/           # CLI command definitions, metadata, and function call handlers
│   ├── db/                 # Database queries and CRUD operations
│   ├── arguments.ts        # Parses and validates user CLI input
│   ├── file-handling.ts    # Updates active user in ./data/configs for SQL operations
│   └── index.ts            # Application entry point
├── .env                    # Environment variables
├── .gitignore              # Ignored files
├── .nvmrc                  
├── drizzle.config.ts
├── LICENSE
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md               # Documentation

# Before running this project locally, ensure you have the following installed:
- IDE (VS Code, PyCharm, etc.)
- Install Python 3.10+ version: visit python.org/downloads/
- Node.js v22.15.0 or higher (version specified in .nvmrc)
- PostgreSQL (local or containerized)

# Dev Dependencies
- TypeScript: static typing and compilation
- @types/node: Node.js type definitions for TypeScript
- tsx: TypeScript execution in Node.js
- drizzle-kit: schema migrations and database tooling

# Dependencies
- dotenv: loads environment variables from a .env file
- zod: runtime schema validation and type-safe data parsing
- fast-xml-parser: RSS/XML parsing
- postgres: PostgreSQL client
- drizzle-orm: type-safe SQL ORM
```

## Quick Start

This repo will later be, if not already, saved as a subfolder. Be sure to only clone relevant files. Then, do the following:

### NodeJS Project Setup

1. Clone repository
2. Install [NVM](https://github.com/nvm-sh/nvm)
   - Save `22.15.0` to `.nvmrc` file
   - Run `nvm use` command to activate node version
3. Run `npm init -y` command to initialize Node.JS project
4. Install dev dependencies: `npm install -D typescript @types/node tsx drizzle-kit`
5. Install regular dependencies: `npm install dotenv zod fast-xml-parser postgres drizzle-orm`
6. Setup configuration files as found here: `tsconfig.json`, `package.json`

### PostgreSQL Database Setup

1. Install [PostgreSQL](https://www.postgresql.org/)
2. Linux (set password): `sudo passwd postgres`
3. Linux (enter psql shell): `sudo -u postgres psql`
4. SQL (create database): `CREATE DATABASE gator;`
5. Drizzle already installed as ORM (steps 4 and 5 above)
6. Save `drizzle.config.ts` file (already done here): includes schema and migration output directors, database type, and database connection url
7. Configure `./data/configs/.db-user-connection.json`: add your local PostgreSQL URL and default username

### Environmental Variables

Open the `.env` file and save your local PostgreSQL connection URL. The URL should end with `gator` (the database name) and include `?sslmode=disable` to turn off SSL/TLS encryption, since the application and database run locally on the same machine.

```
DB_URL=postgres://postgres:postgres@localhost:5432/gator?sslmode=disable
DB_CONFIG_DIR=./data/configs
DB_CONFIG_FILE=.db-user-connection.json
```

### .gitignore File

```
# Node.js dependencies
node_modules/

# Drizzle ORM metadata (auto-generated, can be rebuilt)
data/generated/meta/
```

## Usage

**Run the Program**

> `npm run start COMMAND [ARGUMENTS]`

This application supports multiple commands, each requiring a specific number of arguments. If a user enters an invalid command or provides an incorrect number of arguments, the program prints an error message along with usage instructions.

**Program Commands**

Here are valid `COMMAND [ARGUMENTS]` combinations by table. Of special note is that the `agg` command runs on an infinite loop, which can be terminated by typing `Ctlr+C`. APIs may flag use of the `agg` command based upon request time frequencies.

**users:**
- `register username`: Creates new user record
- `users`: Returns all users
- `login username`: Updates user logged in for tracking database operations
- `reset`: Deletes all users

**feeds:**
- `addfeed feedName feedUrl`: Creates new feed record
- `feeds`: Returns all feeds

**feeds_follows:**
- `follow feedName`: Creates join table record for feed followed by user
- `following`: Returns feed names the user follows
- `unfollow feedName`: Deletes single record for feed followed by user

**posts:**
- `agg timeString`: Creates feed item records for feeds followed by user, limiting requests times
- `browse limitString`: Returns feed item data for feeds followed by user, limiting output rows

## System Design

### 1. Requirements

**Functional Requirements:**

- CLI frontend accepts user commands to fetch RSS feeds and interact with PostgreSQL tables
- Table users: users can register, login, and list all users
- Table feeds: users can save and return normalized feeds
- Table feeds_follows: users can (un)follow feeds and return all followed feeds
- Table posts: users can save and return normalized post items

**Non-Functional Requirements:**

- Low latency: aim for response times under ~200ms
- Scalability: support up to ~1k daily active users (DAU)
- CAP consideration: prioritize consistency (accuracy) over availability
- Reliability: prevent duplicate entities, validate and normalize data
- Rate limiting: set request time limits to avoid DOS attack flag from servers

### 2. Core Entities

PostgreSQL is used locally with four tables locally. The `feeds_follows` table stores a many-to-many relationship between `feeds` ands `users`, tracking what feeds users follow. The `posts` table stores a many-to-one relationship with the `feeds` table, storing RSS feed items. Data is validated with Zod schemas and normalized across all tables.

![Four table schemas are used in this project.](./public/schemas.PNG)

### 3. API (or Interface)

This application uses a **module-level, function-based API** to translate user CLI commands into database operations and terminal output. **No HTTP endpoints** are used. Instead, exported query functions accept validated input from command handlers and execute database operations via Drizzle ORM.

#### Architecture

```
CLI Command
  → Command Handler              # Application layer (input parsing, orchestration, output)
    → Schema Files               # Data contract and constraints
      → Query Function (API)     # Data access layer (API surface)
        → Drizzle ORM            # Maps TypeScript objects ⟷ SQL 
          → PostgreSQ            # CRUD operations
             → Terminal Output   # Success or failure messages

# File Locations:
- Command Handlers: ./src/commands/
- Schema Files: ./data/schemas/
- Query Functions: ./src/db
```

---

#### API Modules

The API is composed of query modules that encapsulate database operations. Each API function performs a single, well-defined database operation and returns normalized data to the command layer.

**Users API:**

- `createUser(name: string) → Promise<User>`
- `getUserByName(username: string): Promise<User | undefined>`
- `getUserByID(userID: string): Promise<User | undefined>`
- `resetUsers(): Promise<void>`

**Feeds API:**

- `createFeed(name: string, url: string, userId: string): Promise<Feed>`
- `getFeeds(): Promise<Feed[]>`
- `getFeedByName(feedName: string): Promise<Feed | undefined>`
- `getFeedByUrl(feedUrl: string): Promise<Feed | undefined>`
- `getFeedNameById(feedId: string): Promise<string | undefined>`
- `getNextFeedToFetch(): Promise<Feed | undefined>`: orders results by last_fetched_at value, retrieving nulls first, then oldest
- `updateFeedFetchedTime(feedId: string): Promise<void>`: uses `new Date()` function to update updated_at and last_fetched_at

**FeedsFollows API:**

- `createFeedFollow(feedId: string, userId: string): Promise<FeedFollow>`
- `getFeedFollow(feedId: string, userId: string): Promise<FeedFollow | undefined>`
- `getFeedIdsFollowedByUserId(userId: string): Promise<string[]>`
- `deleteFeedFollowed(feedId: string, userId: string): Promise<void>`

**Posts API:**

- `createPost(title: string, url: string, description: string, publishedAt: Date, feedId: string): Promise<Post>`: recieves normalized rss feed item data for post creation (read data section for details)
- `getPostsForUser(userId: string, rows: number): Promise<Post[] | undefined>`

### 4. Data Flow

The system follows a **command-driven, synchronous data flow** model, where user input is transformed into **validated, normalized data** before being persisted to a local database. All flows originate from the CLI and end as terminal output. No background jobs, queues, or asynchronous pipelines are used.

**General Flow Pattern:**

```
User Input (CLI)
  → Argument Parsing (getArguments())           # ./src/arguments.ts
    → Command Resolution (COMMANDS registry)    # ./src/commands/commands-meta.ts
      → Command Dispatcher (runCommand())       # ./src/commands/commands.ts
        → Command Handler                       # ./src/commands/*
          → Input Validation / Normalization    # ./src/api/*
            → Query Function (API Module)       # ./src/db/*
              → Drizzle ORM                     # SQL abstraction layer
                → PostgreSQL                    # CRUD operations
              ← Result Set
            ← Normalized Domain Object
        ← Application Logic / Formatting        # ./src/commands/commands-*.ts
      ← Handler Completion
  → Terminal Output
```

---

#### Code-Level Responsibility

**1. Entry Point and Argument Parsing: `index.ts`, `arguments.ts`**

Users run app with `npm run start COMMAND [ARGUMENTS]` command. CLI input gets parsed to determine supplied command names and optional arguments. Dynamically build `registry`, a dictionary of function handler contracts. **Coordinate control flow** without domain logic.

```
await Cmds.runCommand(registry, cmdName, ...cmdArgs);
``` 

**2. Command Registration: `commands-meta.ts`, `commands-types.ts`**

Act as **contracts between user input and application behavior**. Define required mapping between command names and argument numbers with command handler functions. Errors thrown if contracts are violated.

```
export const COMMANDS = {
  CMDKEY: { name: ..., args: ..., handler: ... },
  ...
} as const;
```

**3. Command Dispatch: `commands.ts`**

This layer dynamically determines function handler to use and executes it with supplied arguments.

```
const handler = registry[cmdName];

await handler(cmdName, ...args);
```

**4. Command Handlers: `commands-*.ts`**

These files **orchestrate workflows** by parsing arguments, calling helper functions, and invoking query functions to determine formatted terminal outputs. Handlers **do not** perform raw SQL and data validation themselves.

**5. Data Validation & Normalization: `rss.ts`, `rss-types.ts`**

App uses fetch() API to request external RSS data, which is structurally inconsistent. The fast-xml-parser library converts fetch responses into XML objects. Zod library used to validate data. Additional filtering and transformations normalize data. API and data error handling in place.

```
HTTP fetch
  → XML string
    → parsed JS object (fast-xml-parser)
      → validated & typed JS object (Zod)
        → item coercion + filtering
          → normalized RSSFeed object
```

**6. SQL Queries: `queries-*.ts`, `file-handling.ts`**

The application **data access layer** is defined here. Each query uses the Drizzle ORM to translate TypeScript function handlers into PostgreSQL CRUD operations. User context (the currently logged-in user) is passed into queries to log ownership for auditing purposes.

---

#### Example Data Flows

**User Registration Flow:**

```
CLI: register <username>
  → handlerRegister()                    # commands-users.ts
    → getUserByName(username)
    → createUser(username)
      → Drizzle INSERT(users)
        → PostgreSQL
      ← User row
    → update config.json
  → Terminal output
```

**Feed Creation Flow:**

```
CLI: addfeed <name> <url>
  → handlerAddFeed()                     # commands-feeds.ts
    → checkCurrentUser()
    → getFeedByUrl(url)
    → createFeed(name, url, userId)
      → Drizzle INSERT(feeds)
        → PostgreSQL
      ← Feed row
    → createFeedFollow(feedId, userId)
      → Drizzle INSERT(feeds_follows)
        → PostgreSQL
  → Terminal output
```

**Feed Follow Creation Flow:**

```
CLI: follow <feedUrl>
  → handlerFollow()                      # commands-feedsfollows.ts
    → checkCurrentUser()
    → getFeedByUrl(feedUrl)
    → getFeedFollow(feedId, userId)
    → createFeedFollow(feedId, userId)
      → Drizzle INSERT(feeds_follows)
        → PostgreSQL
  → Terminal output
```

**RSS Aggregation and Post Storage Flow:**

```
CLI: agg <feedUrl>
  → handlerAggregator()                  # commands-posts.ts
    → fetchFeed(feedUrl)
      → rss.http.ts
      → rss.types.ts
      → rss.ts (normalization)
    → createPost(...)
      → Drizzle INSERT(posts)
        → PostgreSQL
    → updateFeedFetchedTime(feedId)
```

### 5. High Level Design

```
┌───────────────────────────────┐
│         CLI Interface         │
│   (User Commands + Output)    │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│       Command Handlers        │
│  (Application Orchestration)  │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│  Validation & Normalization   │
│   (RSS Fetch + Zod Schemas)   │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        Query API Layer        │
│    (Drizzle ORM Functions)    │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│          PostgreSQL           │
│     (Persistent Storage)      │
└───────────────────────────────┘
```

## Credits and Contributing

[Boot.dev](https://www.boot.dev/) provided the project requirements and guidance to complete this project. Contributions are welcome! Feel free to report any problems.
