import { COMMANDS, type CommandMeta } from "./commands.meta.js";


/* 
* Returns a list of arguments passed in the terminal.
* Exits with code 1 if no user arguments are provided.
*/
export function getArguments(): string[] {
    const args = process.argv.slice(2); // slice first 2 user args → skip Node + script path

    // Failure: User did not pass a command name.
    if (args.length === 0) {
        console.error("Error: Did not provide command name.");
        console.log("Usage: npm run start -- <commandName> [...arguments]");
        process.exit(1);
    }

    // Failure: User passed unknown command name.
    const cmdName = args[0];
    const cmdMeta = Object.values(COMMANDS).find((cmd: CommandMeta) => cmd.name === cmdName);
    if (!cmdMeta) {
        console.error(`Error: Command ${cmdName} is not registered to use.`);
        console.log("Available Commands:");
        Object.values(COMMANDS)
            .forEach( cmd => {
                console.log(`* npm run start ${cmd.name} [${cmd.args} arguments]`);
            }
        );
        process.exit(1);
    }

    // Failure: User passed command name with wrong number of arguments.
    const inputArgsCount = args.length - 1;
    if (inputArgsCount !== cmdMeta.args) {
        console.error(`Error: Command ${cmdName} expects ${cmdMeta.args} arguments. You provided ${inputArgsCount} arguments.`);
        console.log("Usage: npm run start -- <commandName> [...arguments]");
        process.exit(1);
    }

    return args;
}

