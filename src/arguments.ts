import type { CommandRegistry } from "./commands.types.js";


/* 
* Returns a list of arguments passed in the terminal.
* Exits with code 1 if no user arguments are provided.
*/
export function getArguments(): string[] {
    const args = process.argv.slice(2); // slice first 2 user args → skip Node + script path

    if (args.length < 2) {
        console.error("Error: Must provide command name and at least one argument.");
        console.log("Usage: npm run start -- commandName ...arguments");
        process.exit(1);
    }

    return args;
}


/*
* Returns command name and argument from CLI arguments.
* Exits with code 1 if both not provided.
*/
export function getCmdAndArgs(registry: CommandRegistry, args: string[]): [string, string[]] {
    const cmdName = args[0];
    const cmdArgs = args.slice(1);

    // Check that the command exists in the registry
    if (!registry[cmdName]) {
        console.error(`Error: Unknown command "${cmdName}".`);
        console.log("Available commands:", Object.keys(registry).join(", "));
        process.exit(1);
    }

    return [cmdName, cmdArgs];
}
