import { baseRequest } from './lib/baseRequest';

type Options = {
    language: 'english' | 'korean' | 'chinese' | 'japanese' | 'spanish' | 'russian' | 'french' | 'portuguese' | 'german' | 'italian' | 'dutch' | 'indonesian' | 'filipino' | 'vietnamese';
    text: string;
    token: string;
    spaceId?: string;
    onPump?: ((part: string) => void) | undefined;
}

export const translate = async ({ language, text, token, spaceId, onPump }: Options) => {
    const answer = await baseRequest({
        context: {
            language,
            text,
            type: 'translate',
        },
        spaceId,
        token,
        onPump
    });

    return answer;
}
