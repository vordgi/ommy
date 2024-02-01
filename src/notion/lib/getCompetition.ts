import { BASE_URL } from './constants';

type ContextType = {
    type: string;
    question?: string;
    pageTitle?: string;
    selectedText?: string;
    systemInstructions?: string;
    transcript?: any[];
    isBlockCitations?: boolean;
};

type Options = {
    aiSessionId: string;
    spaceId: string;
    token: string;
}

const decoder = new TextDecoder();

const getCompletion = async (context: ContextType, options: Options, onPump?: (part: string) => void) => {
    const { aiSessionId, spaceId, token } = options;
    const questionResp = await fetch(`${BASE_URL}/getCompletion`, {
        headers: {
            "accept": "application/x-ndjson",
            "content-type": "application/json",
            "Cookie": `token_v2=${token};`,
        },
        body: JSON.stringify({
            aiSessionId,
            context: context,
            model: "openai-2",
            spaceId,
            isSpacePermission: false,
            metadata: {},
        }),
        method: "POST",
    });
    const reader = questionResp.body?.getReader();

    if (!reader) {
        throw new Error('omy: Something went wrong');
    }

    const result: any[] = [];
    let resultText = '';
    function pump():any {
        return reader!.read().then(({ done, value }) => {
            if (done) return;

            let str: string = '';
            if (value) {
                str = decoder.decode(value);
            }

            try {
                const targetRows = str.split('\n').filter(Boolean);
                targetRows.forEach(row => {
                    const part = JSON.parse(row);
                    if (part.type === 'success') {
                        resultText += part.completion;
                        onPump?.(part.completion);
                    } else if (part.message) {
                        console.log(`omy: ${part.message}`);
                    }
                    result.push(part);
                })
            } catch (e) {
                console.log(e);
            }
            return pump();
        });
    }
    await pump();
    return resultText;
}

export default getCompletion;
