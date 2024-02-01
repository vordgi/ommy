import { v4 as uuidv4 } from 'uuid';
import getCompletion from "./getCompetition";
import getSpaces from "./getSpaces";

type Options = {
    context: { [key: string]: string };
    token: string;
    spaceId?: string;
    onPump?: ((part: string) => void) | undefined;
}

export const baseRequest = async ({ context, token, spaceId, onPump }: Options) => {
    let targetSpaceId = spaceId;
    try {
        if (!spaceId) {
            const spaces = await getSpaces(token);
            const targetUserSpaces = Object.values(spaces)[0] as any;
            targetSpaceId = Object.keys(targetUserSpaces.space)[0];
        }
    } finally {
        if (!targetSpaceId) {
            throw new Error('Failed to get spaceId');
        }
    }

    const options = {
        aiSessionId: uuidv4(),
        spaceId: targetSpaceId,
        token,
    }

    // format answer
    const answer = await getCompletion(context as any, options, onPump);

    return answer;
}
