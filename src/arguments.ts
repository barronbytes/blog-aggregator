/* 
* Returns list of arguments passed in terminal
*/
export function getArguments(): string[] {
    const args = process.argv;
    return args.slice(2);
}
