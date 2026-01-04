// --------------------
// DECLARATIONS
// --------------------


/* CommandHandler(cmdName, ...args): void */
export type CommandHandler = (cmdName: string, ...args: string[]) => void;


/* Holds all commands the CLI can handle */
export type CommandRegistry = {
    [cmdName: string]: CommandHandler;
}
