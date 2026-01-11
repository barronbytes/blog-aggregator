import { XMLParser } from "fast-xml-parser";


/* Headers used for all GET requests to identify the client. */
const headersGET = {
    "User-Agent": "gator",
}


/* Settings object for GET reqeusts. */
export const settingsGET = {
    method: "GET",
    headers: headersGET,
};


/* XML parser instance for converting XML strings to JS objects. */
export const parser = new XMLParser();
