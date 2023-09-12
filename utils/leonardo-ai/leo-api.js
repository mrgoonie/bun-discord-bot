import api from 'api';
import Config from 'config/env';
import { wait } from 'plugins/helper/wait';

const sdk = api('@leonardoai/v1.0#28807z41owlgnis8jg');
sdk.auth(Config.LEONARDO_KEY);

export const leoModels = [
    { id: 'ac614f96-1082-45bf-be9d-757f2d31c174', name: 'DreamShaper v7' },
    { id: 'b7aa9939-abed-4d4e-96c4-140b8c65dd92', name: 'DreamShaper v6' },
    { id: 'f1830509-5b3e-48d5-a57d-923815ca7a0c', name: 'Little Heroes' },
    { id: 'e316348f-7773-490e-adcd-46757c738eb7', name: 'Absolute Reality v1.6' },
    { id: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', name: 'Leonardo Creative' },
    { id: 'cd2b2a15-9760-4174-a5ff-4d2925057376', name: 'Leonardo Select' },
    { id: '291be633-cb24-434f-898f-e662799936ad', name: 'Leonardo Signature' },
    { id: 'a097c2df-8f0c-4029-ae0f-8fd349055e61', name: 'RPG 4.0' },
    { id: 'd69c8273-6b17-4a30-a13e-d6637ae1c644', name: '3D Animation Style' },
    { id: 'f0b6a3ea-63e0-4651-8b19-5971f599b57e', name: 'Pro Anime Style Gen 2.0' },
    { id: '1aa0f478-51be-4efd-94e8-76bfc8f533af', name: 'Anime Pastel Dream' },
    { id: 'e51fb57a-cbdc-4790-9738-04a347ce8445', name: 'Isometric Diffusion 2.1 (3D Lands)' },
];

/**
 * Represents an object containing information about generations by primary key.
 *
 * @typedef {Object} GenerationsByPK
 * @property {GeneratedImage[]} generated_images - An array of generated images.
 * @property {string} modelId - The unique identifier of the model.
 * @property {string} prompt - The prompt used for generation.
 * @property {string} negativePrompt - The negative prompt used for generation.
 * @property {number} imageHeight - The height of the generated images.
 * @property {number} imageWidth - The width of the generated images.
 * @property {number} inferenceSteps - The number of inference steps.
 * @property {number} seed - The seed used for generation.
 * @property {boolean} public - Indicates whether the generation is public.
 * @property {string} scheduler - The scheduler used for generation.
 * @property {string} sdVersion - The version of the software-defined model.
 * @property {"PENDING"|"COMPLETE"|"FAILED"} status - The status of the generation.
 * @property {null} presetStyle - The preset style used for generation.
 * @property {null} initStrength - The initial strength used for generation.
 * @property {number} guidanceScale - The guidance scale used for generation.
 * @property {string} id - The unique identifier of the generation.
 * @property {string} createdAt - The timestamp when the generation was created.
 */

/**
 * Represents a generated image.
 *
 * @typedef {Object} GeneratedImage
 * @property {string} url - The URL of the generated image.
 * @property {boolean} nsfw - Indicates whether the image is NSFW.
 * @property {string} id - The unique identifier of the image.
 * @property {number} likeCount - The count of likes for the image.
 * @property {GeneratedImageVariationGeneric[]} generated_image_variation_generics - An array of generated image variation generics.
 */

/**
 * Represents a generated image variation generic.
 *
 * @typedef {Object} GeneratedImageVariationGeneric
 */

/**
 * Represents an AI prompt data transfer object.
 *
 * @typedef {Object} AIDto
 * @property {string} prompt - The prompt used to generate images
 * @property {string} negative_prompt - The negative prompt used for the image generation
 * @property {string} [modelId] - The model ID used for the image generation.
 * @property {integer} [num_images=1] - The number of images to generate.
 * @property {integer} [guidance_scale=15] - How strongly the generation should reflect the prompt (1-20), default is `15`.
 * @property {integer} [width] - The width of the images.
 * @property {integer} [height] - The height of the images.
 * @property {integer} [alchemy=true] - Enable to use Alchemy.
 * @property {string} [init_generation_image_id] - The ID of an existing image to use in image2image.
 * @property {string} [init_image_id] - The ID of an Init Image to use in image2image.
 * @property {number} [init_strength] - How strongly the generated images should reflect the original image in image2image. Must be a float between 0.1 and 0.9.
 * @property {boolean} [controlNet] - Enable to use ControlNet. Requires an init image to be provided. Requires a model based on SD v1.5
 * @property {"POSE"|"CANNY"|"DEPTH"} [controlNetType] - The type of ControlNet to use.
 * @property {boolean} [promptMagic] - Enable to use Prompt Magic.
 * @property {boolean} [nsfw] - Not Safe For Work Flag.
 */

/**
 * Leonardo.AI Generation Job
 *
 * @typedef {Object} LeoGenerationJob
 * @property {string} generationId - The id of the generative result.
 */

/**
 * Represents the response data from Leonardo.AI API
 *
 * @typedef {Object} LeoGenerationResponse
 * @property {LeoGenerationJob} sdGenerationJob - Leonardo.AI Generation Job.
 */

/**
 * Represents the response data from Leonardo.AI API
 *
 * @typedef {Object} LeoResponse
 * @property {LeoGenerationResponse} data - Leonardo.AI Generation Job.
 */

/**
 * Options of Generate image by AI request
 *
 * @typedef {Object} LeoGenerateOptions
 * @property {boolean} [isDebugging] - Indicates whether debugging is enabled.
 * @property {(data: GenerationsByPK) => void} [onUpdate] - Update callback.
 * @property {(data: {error:string}) => void} [onError] - Error callback.
 * @property {string} [username] - Name of the user who made the request
 */

/**
 * Generate image by AI using prompt
 *
 * @param {AIDto} data - The AI prompt data transfer object.
 * @param {LeoGenerateOptions} options
 * @returns {Promise<GenerationsByPK>}
 */
export async function leoGenerate(data, options) {
    // default values
    if (!data.modelId) data.modelId = leoModels[0].id;
    if (!data.num_images) data.num_images = 2;
    if (!data.width) data.width = 512;
    if (!data.height) data.height = 512;
    // if (typeof data.alchemy === "undefined") data.alchemy = true;
    if (typeof data.guidance_scale === 'undefined') data.guidance_scale = 15;
    if (typeof data.nsfw === 'undefined') data.nsfw = false;

    if (options?.isDebugging) console.log('[LEO AI] Generate > data :>> ', data);

    try {
        /**
         * @type {{data: LeoGenerationResponse}}
         */
        const result = await sdk.createGeneration(data);
        if (options?.isDebugging) console.log(`[LEO AI] Generate images > result.data :>>`, result.data);

        // get images
        const { generationId } = result.data.sdGenerationJob;

        const resultImages = await leoGetGenerationImages(generationId, options);
        // const { generated_images, status } = resultImages;
        // if (options?.isDebugging) console.log('[LEO AI] Generate images > generated_images :>> ', generated_images);
        // if (options?.isDebugging) console.log('[LEO AI] Generate images > status :>> ', status);

        return resultImages;
    } catch (error) {
        console.error(`[LEO AI] Generate images > error :>>`, error);
        if (error.response) {
            if (options?.onError) options.onError(error.response.data);
        } else if (error.data) {
            if (options?.onError) options.onError(error.data);
        } else if (error.res) {
            if (options?.onError) options.onError(error.res.data);
        } else {
            if (options?.onError) options.onError({ error: error.message });
        }
    }
}

/**
 * Get images of a generation
 *
 * @param {string} id - The ID of the generation.
 * @param {LeoGenerateOptions} options
 * @returns {Promise<GenerationsByPK>}
 */
export async function leoGetGenerationImages(id, options) {
    if (options?.isDebugging) console.log('[LEO AI] Get generation images > id :>> ', id);

    try {
        /**
         * @type {{ data: { generations_by_pk: GenerationsByPK } }}
         */
        const result = await sdk.getGenerationById({ id });
        if (options?.isDebugging) console.log(`[LEO AI] Get generation images > result.data :>>`, result.data);

        // keep fetching until finishing
        if (result.data.generations_by_pk.status == 'PENDING') {
            if (options?.onUpdate) options.onUpdate(result.data.generations_by_pk);
            await wait(5000);
            await leoGetGenerationImages(id, options);
        }

        if (options?.onUpdate) options.onUpdate(result.data.generations_by_pk);
        return result.data.generations_by_pk;
    } catch (error) {
        console.error(`[LEO AI] Get generation images > error :>>`, error.message);
        if (options?.onError) options.onError({ error: error.message });
        return;
    }
}
