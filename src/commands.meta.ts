import * as Cmds from "./commands.js";


/**
 * CLI command metadata:
 * - name: actual CLI command string
 * - args: number of arguments the command expects
 * - handler: function that handles command
 */
export const COMMANDS = {
  RESET: { name: "reset", args: 0, handler: Cmds.handlerReset },
  USERS: { name: "users", args: 0, handler: Cmds.handlerUsers },
  REGISTER: { name: "register", args: 1, handler: Cmds.handlerRegister },
  LOGIN: { name: "login", args: 1, handler: Cmds.handlerLogin },
  AGGREGATOR: { name: "agg", args: 0, handler: Cmds.handlerAggregator },
  ADDFEED: { name: "addfeed", args: 2, handler: Cmds.handlerAddFeed }
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


/**
 * Dynamically generate array of command names with no arguments (args: 0):
 * - ["reset", "users"]
 */
export const NoArgCmds: string[] = Object.values(COMMANDS)
  .filter(cmd => cmd.args === 0)
  .map(cmd => cmd.name);
