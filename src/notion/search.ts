import { v4 as uuidv4 } from 'uuid';
import { BASE_URL, NOTION_INSTRUCTION } from "./constants";
import getCompletion from "./getCompetition";
import getSpace from "./getSpace";

// "The rate limit for incoming requests per integration is an average of three requests per second".
// But for AI the limit seems to be smaller (three requests per 10 seconds?), so requests have to be delayed
const sleep = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 5050);
    })
}

export const search = async (text: string, token: string, onPump?: ((part: string) => void) | undefined) => {
    const spaceId = await getSpace(token);
    const options = {
        aiSessionId: uuidv4(),
        spaceId,
        token,
    }
    // format question
    const resultText = await getCompletion({
        "type": "generateTimelyQueryAndKeywords",
        "question": text,
    }, options)
    const attrsMatched = resultText.match(/<search question="(?<question>.+)" keywords="(?<keywords>.+)" lookback="(?<lookback>.+)"\/>/);

    if (!attrsMatched?.groups) {
        throw new Error('!attrsMatched?.groups');
    }

    await sleep();
    const { question, keywords, lookback } = attrsMatched.groups;

    // search
    const aiSearchResp = await fetch(`${BASE_URL}/performAiSearch`, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/json",
            "Cookie": `token_v2=${token};`,
        },
        "body": JSON.stringify({
            question,
            keywords,
            lookback,
            "scope": {
                "type": "everything"
            },
            "spaceId": "ed2c1a8e-9ccc-48ae-9119-9dafcfcb4ff2",
            "aiSessionId": "dea51c8e-7ccd-44f8-9fa7-eadb6ff39331",
            "source": "assistant"
        }),
        "method": "POST",
    });
    const aiSearchRow = await aiSearchResp.text();
    const aiSearchResult = JSON.parse(aiSearchRow);

    await sleep();
    // format answer
    const answer = await getCompletion({
        "type": "generateAnswer",
        "systemInstructions": NOTION_INSTRUCTION,
        "transcript": [
            {
                "id": 1,
                "type": "human",
                "value": `<chat><text>${text}</text></chat>`
            },
            {
                "type": "assistant",
                "id": 2,
                "value": resultText,
                "inferenceId": "c1d64854-b8ca-4297-9c15-9d07db8d4b6a"
            },
            {
                "type": "observation",
                "observationType": "search",
                "value": aiSearchResult.results.map((result: any) => `<context>${result.title}${result.text}<context>`).join(''),
                "id": 3
            }
        ],
        "isBlockCitations": false
    }, options, onPump);
    const answerClean = answer.replace(/<a href="[^"]+" ?\/>/g, '').trim();

    return answerClean;
}
