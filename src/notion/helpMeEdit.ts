import { baseRequest } from './lib/baseRequest';

type Options = {
    prompt: string;
    token: string;
    spaceId?: string;
    onPump?: ((part: string) => void) | undefined;
}

export const helpMeEdit = async ({ prompt, token, spaceId, onPump }: Options) => {
    const answer = await baseRequest({
        context: {
            pageContent: "",
            pageTitle: "",
            prompt,
            selectedText: "",
            type: "helpMeEdit",
        },
        spaceId,
        token,
        onPump
    });

    return answer;
}
