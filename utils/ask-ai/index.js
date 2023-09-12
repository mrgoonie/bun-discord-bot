import Config from 'config/env';
import { aiApi } from 'plugins/ask-ai/ai-api';

export function combineCodeSnippetInMessageArray(inputArray) {
    const combinedArray = [];
    let combinedItem = '';

    for (const line of inputArray) {
        if (line.startsWith('```')) {
            if (combinedItem !== '') {
                combinedArray.push(combinedItem);
                combinedItem = '';
            }
            combinedItem += line + '\n';
        } else if (combinedItem !== '') {
            combinedItem += line + '\n';
        } else {
            combinedArray.push(line);
        }

        if (line.endsWith('```')) {
            combinedArray.push(combinedItem);
            combinedItem = '';
        }
    }

    return combinedArray;
}

/**
 *
 * @param {string} question
 * @param {string} model - Default: `google/palm-2-codechat-bison`
 * @returns {Promise<string[]|{error:string}>}
 */
export async function askAi(question, model = aiModels[0], username = '') {
    if (Config.DEBUG) console.log('[ASK AI] Question :>> ', question);

    /**
     * @type {import('plugins/ask-ai/ai-api').AskAIDto}
     */
    const data = {
        model,
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.',
            },
            {
                role: 'user',
                content: question,
            },
        ],
    };

    // make request to OpenRouter.AI
    const res = await aiApi({
        data,
        username,
        isDebugging: Config.DEBUG,
    });
    if (Config.DEBUG) console.log('[ASK AI] res :>> ', res);
    // console.log('res.choices[0] :>> ', res.choices[0]);

    if (res.status === 0) {
        // error catching
        return { error: res.messages[0] || 'Unexpected Server Error' };
    } else {
        const { content: aiResponse } = res.choices[0].message;

        // split message into sentences
        let resMsgs = aiResponse.length < 1500 ? [aiResponse] : aiResponse.split('\n\n');

        // combine only code snippets
        resMsgs = combineCodeSnippetInMessageArray(resMsgs);

        if (Config.DEBUG) console.log('[ASK AI] Answers :>> ', resMsgs);

        return resMsgs;
    }
}
