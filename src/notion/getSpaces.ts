import { BASE_URL } from "./constants";

const getSpaces = async (token: string) => {
    const spacesResp = await fetch(`${BASE_URL}/getSpaces`, {
        headers: {
            "accept": "application/x-ndjson",
            "content-type": "application/json",
            "Cookie": `token_v2=${token}`,
        },
        "method": "POST",
    });
    const spaces = await spacesResp.json();
    return spaces;
}

export default getSpaces;
