import axios from 'axios';
import { isEmpty } from 'lodash';
import Config from 'config/env';

export const OPENROUTER_BASE_API_URL = 'https://openrouter.ai/api/v1';

export const aiModels = [
    'openai/gpt-3.5-turbo',
    'openai/gpt-3.5-turbo-16k',
    'openai/gpt-4',
    'openai/gpt-4-32k',
    'google/palm-2-codechat-bison',
    'google/palm-2-chat-bison',
    'anthropic/claude-2',
    'anthropic/claude-instant-v1',
    'meta-llama/llama-2-13b-chat',
    'meta-llama/llama-2-70b-chat',
    'nousresearch/nous-hermes-llama2-13b',
    'mancer/weaver',
    'gryphe/mythomax-L2-13b',
];

/**
 * Represents an AI data transfer object.
 *
 * @typedef {Object} AskAIDto
 * @property {AIModel} [model] - The AI model.
 * @property {Array<{ role: "system" | "user"; content: string }>} messages - An array of messages.
 */

/**
 * Represents the response data from an open router.
 *
 * @typedef {Object} OpenRouterResponseData
 * @property {AIModel} model - The AI model.
 * @property {Array<{ message: { role: string; content: string } }>} choices - An array of choices.
 */

/**
 * Represents a configuration object for an Axios request with additional properties.
 *
 * @typedef {Object} CustomAxiosRequestConfig
 * @property {AxiosRequestConfig} [AxiosRequestConfig] - The Axios request configuration.
 * @property {AskAIDto} [data] - The AI data transfer object.
 * @property {string} [apiKey] - The API key.
 * @property {boolean} [isDebugging] - Indicates whether debugging is enabled.
 * @property {string} [username] - Name of the user who made the request
 */

/**
 * @param {CustomAxiosRequestConfig} options
 * @returns {OpenRouterResponseData}
 */
export async function aiApi(options) {
    if (!options) options = {};
    if (!options.method) options.method = 'POST';

    const { method, apiKey } = options;

    options.username = options?.username || 'Anonymous';
    options.baseURL = OPENROUTER_BASE_API_URL;
    if (!options.url) options.url = '/chat/completions';

    // default headers
    let headers = {
        'HTTP-Referer': Config.BASE_URL,
        'X-Title': `DIGICORD (${Config.ENV_SHORT})`,
    };
    if (!isEmpty(options.headers)) headers = { ...headers, ...options.headers };

    // Authentication
    if (Config.OPENROUTER_KEY) headers.Authorization = `Bearer ${Config.OPENROUTER_KEY}`;
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    if (['POST', 'PATCH', 'DELETE'].includes(method?.toUpperCase())) {
        if (isEmpty(headers['content-type'])) headers['content-type'] = 'application/json';
    }

    // if (options.data) options.data = new URLSearchParams(options.data);
    options.headers = headers;
    if (options.isDebugging) console.log(`aiApi: ${options.url} > options.headers :>>`, options.headers);
    if (options.isDebugging) console.log(`aiApi: ${options.url} > options.data :>> `, options.data);
    if (options.isDebugging) console.log(`aiApi: ${options.url} > options.method :>> `, options.method);

    try {
        const res = await axios(options);
        const { data: responseData } = res;
        if (options.isDebugging) {
            console.log(`aiApi: ${options.url} > response data :>> `);
            console.dir(responseData, { depth: 10 });
        }
        return responseData;
    } catch (e) {
        // if (options.isDebugging) console.log(`aiApi: ${options.url} > e :>> `, e);
        if (options.isDebugging) console.log(`aiApi: ${options.url} > e.response :>> `, e.response);
        if (options.isDebugging) console.log(`aiApi: ${options.url} > e.message :>> `, e.message);
        const err = e.response?.data.error.message || e.message;
        return { status: 0, messages: [`${err}`] };
    }
}
