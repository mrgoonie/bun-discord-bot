import { askAi, combineCodeSnippetInMessageArray } from 'plugins/ask-ai';
import { aiModels } from 'plugins/ask-ai/ai-api';
import getChannelByName from 'plugins/helper/channels/getChannelByName';

/**
 * Use ChatGPT to generate JS/TS code snippet
 * @returns {Promise<string[]>}
 */
export const generateJavascriptTips = async () => {
    // Quote prompt + ChatGPT 3.5 Turbo Model
    const question = `hãy gửi cho tôi duy nhất một (1) đoạn mã thú vị về mẹo và thủ thuật hữu dụng của ngôn ngữ lập trình JavaScript, TypeScript, hoặc Node.js, bắt đầu câu trả lời với "[💡TIP]`;
    const model = aiModels[0];
    const quoteRes = await askAi(question, model);

    // catch error
    if (quoteRes.error) throw new Error(quoteRes.error);

    // result
    return combineCodeSnippetInMessageArray(quoteRes);
};

export const sendJavascriptTipsDaily = async (channelName) => {
    const channel = getChannelByName(channelName || 'technical'); // channel: "technical"
    const messages = await generateJavascriptTips();

    // send the messages of an answer:
    for (const msg of messages) {
        await channel.send({ content: msg });
    }

    // const message = await channel.send({ content });
    // message.react('<:quaylen:1075458986352050336>');
    // return message;
};
