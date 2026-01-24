# Blog Aggregator

CLI-based RSS aggregator that translates user commands into TypeScript function calls. These functions execute PostgreSQL operations and return user, feed, follow, and post data as terminal output.

**Project Demo:**

...

## Tech Stack

* **Frontend:** None (CLI-based application)
* **Backend:** TypeScript, PostgreSQL
* **Runtime:** Node.js
* **Tooling:** npm, Drizzle, Zod

## Project Structure

```
blog-aggregator/
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
├── .gitignore              # Ignored files
├── .env                    # Environment variables
├── drizzle.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .nvmrc                  
└── README.md               # Documentation

# Before running this project locally, ensure you have the following installed:
- IDE (VS Code, PyCharm, etc.)
- Install Python 3.10+ version: visit python.org/downloads/
- Node.js v22.15.0 or higher (version specified in .nvmrc)
- PostgreSQL (local or containerized)

# Dev Dependencies
- TypeScript: static typing and compilation
- @types/node: Node.js type definitions for TypeScript
- drizzle-kit: schema migrations and database tooling
- tsx: TypeScript execution in Node.js

# Dependencies
- dotenv: loads environment variables from a .env file
- postgres: PostgreSQL client
- drizzle-orm: type-safe SQL ORM
- fast-xml-parser: RSS/XML parsing
- zod: runtime schema validation and type-safe data parsing
```

## Quick Start

Clone relevant files. Then, do the following:

### Project and Dependencies Setup

...

### Environmental Variables Setup

...

### .gitignore File Setup

...

## Usage

**Run the Program**

> `npm run start COMMAND [ARGUMENTS]`

This program has numerous commands that each enforce passing the correct number of arguments. Error messages are printed out with usage advice whenever this contract is broken.

At the moment, the program requires you have the following file path saved: `~/gatorconfig.json`. This is a configuration file for the database. A sample structure for the file is found in the `./data/configs` directory in this repository. Additionally, for the program to run you should open the `.env` file and save the `DB_CONFIG_DIR=/home/YOUR_USERNAME` variable to include your username instead of mine. This program will later be updated to avoid these manual adjustments. 

**Program Commands**

As stated, each command must be precedded by `npm run start` in the terminal. This list mentions the `COMMAND [ARGUMENTS]` portion of commands that must be passed.

> `reset`: No arguments. Clears all records from `users` table.
> `users`: No arguments. Returns all users from `users` table.
> `register username`: 1 argument. Creates new record in `users` table.
> `login username`: 1 argument. Authenticates user for database activity.
> `agg`: 0 arguments. Returns validated XML from RSS feed.
> `addfeed name url`: 2 arguments. Creates new record in `feeds` table.
> `feeds`: 0 arguments. Returns all feeds from `feeds` table.

## System Design

### 1. Requirements

**Functional Requirements:**

...

**Non-Functional Requirements:**

...

### 2. Core Entities

...

### 3. API (or Interface)

...

### 4. Data Flow

...

### 5. High Level Design

...

## Credits and Contributing

[Boot.dev](https://www.boot.dev/) provided the project requirements and guidance to complete this project. Contributions are welcome! Feel free to report any problems.
