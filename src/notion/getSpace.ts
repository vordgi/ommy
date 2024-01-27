import { BASE_URL } from "./constants";

const getSpace = async (token: string) => {
    const spacesResp = await fetch(`${BASE_URL}/getSpaces`, {
        headers: {
            "accept": "application/x-ndjson",
            "content-type": "application/json",
            "Cookie": `token_v2=${token}`,
        },
        "method": "POST",
    });
    const spaces = await spacesResp.json();
    const targetUserSpaces = Object.values(spaces)[0] as any;

    return Object.keys(targetUserSpaces.space)[0];
}

export default getSpace;
