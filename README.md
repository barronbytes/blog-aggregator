# Blog Aggregator

This is a terminal app currently in-progress that works locally. The usage section of this README details the comamnds the app accepts. The program uses two local PostgreSQL tables to store user and RSS feed information. When complete, the commands and database functions will be extended to save and return any RSS feed data. At the moment the app currently only accepts one RSS feed.

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
├── 
├── 
└── README.md                       # Project documentation

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

At the moment, the program requires you have the following file path saved: `~/gatorconfig.json`. This is a configuration file for the database. A sample structure for the file is found in the `./data/configs` directory in this repository.

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
