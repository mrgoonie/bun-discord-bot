import { Message, APIEmbed } from 'discord.js';
import {
    //
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

import { leoGenerate, leoModels } from '@/utils/leonardo-ai/leo-api';

// Test...
// leoGenerate({
//     // prompt: `a fantasy beast looks like a mouse with body is made by flame, fire, standing in 2 feets, long hair, old, cloak, muscle, strong, cool, wise, dark background, light from behind, closing eyes, fog, reflection, mysterious, spirit, zoom in, 8k`,
//     prompt: `a fantasy monkey with body is made by stones, rocks, dirt, hidden in big tree, mature, strong, cool, viking, dark background, light from behind, shining eyes, reflection, mysterious`
// }, {
//     isDebugging: true,
//     onUpdate: (data) => {
//         console.log('[UPDATE] data :>> ', data);
//     }
// });

module.exports = {
    // input
    data: new SlashCommandBuilder()
        .setName('draw')
        .setDescription('Draw image using AI prompts')
        .addStringOption((option) => option.setName('prompt').setDescription('The prompt used to generate images').setRequired(true))
        .addStringOption((option) => option.setName('negative_prompt').setDescription('The negative prompt used for the image generation').setRequired(false))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Select the AI model')
                .addChoices(
                    ...leoModels.map((model, index) => ({ name: model.name, value: model.id, default: index === 0 }))
                )
        )
        .addBooleanOption((option) => option.setName('private').setDescription('Send result privately (default: TRUE)').setRequired(false))
        .addStringOption((option) =>
            option.setName('ratio')
                .setDescription('Ratio of the results (default is 1:1)')
                .addChoices(
                    ...["1:1", "3:4", "4:3", "3:5", "5:3", "2:4", "4:2"].map((ratio, index) => ({ name: ratio, value: ratio, default: index === 0 }))
                )
        )
        .addNumberOption((option) => option.setName('amount').setDescription('Amount of generated results (default: 2)'))
        .addBooleanOption((option) => option.setName('nsfw').setDescription('Not Safe For Work Flag (default: false'))
    ,

    async execute(interaction) {
        const ephemeral = interaction.options.get('private')?.value ?? true;

        try {
            const { user, member, data } = interaction;

            // author
            const authorId = user.id;
            const username = user.username || "Anonymous";

            const prompt = interaction.options.get('prompt')?.value;
            const negative_prompt = interaction.options.get('negative_prompt')?.value;
            const model = interaction.options.get('model')?.value || leoModels[0].id;
            const modelName = leoModels.find(m => m.id === model)?.name ?? "Unknown";
            const ratioStr = interaction.options.get('ratio')?.value || "1:1";
            const ratio = ratioStr.split(":");
            const size = ratioStr === "1:1" ? [512, 512] : [128 * ratio[0], 128 * ratio[1]];
            const amount = parseInt(interaction.options.get('amount')?.value) || 2;
            const nsfw = interaction.options.get('nsfw')?.value ?? false;

            /** @type {Message} */
            const message = await interaction.reply({
                content: `❓ __AI Draw:__\n- Model: ${modelName}\n- Prompt:\n> *${prompt}*${negative_prompt ? `\n- Negative prompt:\n> *${negative_prompt}*` : ""}\n- Ratio: ${ratioStr}\n⏳ Đại ca chờ em chút...`,
                ephemeral,
            });

            // generate & update reply
            leoGenerate({
                prompt,
                negative_prompt,
                modelId: model,
                promptMagic: true,
                num_images: amount,
                width: size[0],
                height: size[1],
                nsfw,
            }, {
                isDebugging: process.env.DEBUG,
                onError: ({ error }) => {
                    console.log('[AI GENERATING] error :>> ', error);
                    message.edit({
                        content: `❓ __Generate AI image:__\n- Model: ${modelName}\n- Prompt:\n> *${prompt}*${negative_prompt ? `\n- Negative prompt:\n> *${negative_prompt}*` : ""}\n- Ratio: ${ratioStr}\n❌ **Lỗi zồi (${error})... nô tài vô dụng quá <@${authorId}> ơi...**`,
                    })
                },
                onUpdate: (data) => {
                    if (!data) return;

                    console.log('[AI GENERATING] data :>> ', data);

                    if (data.status === "COMPLETE") {
                        // TODO: Integrate upscale feature
                        // for(let i=0; i<amount; i++){
                        // }
                        // const components = [
                        //     new ActionRowBuilder().addComponents(
                        //         new ButtonBuilder().setLabel('U1').setStyle(ButtonStyle.Primary).,

                        //     ),
                        // ];

                        /**
                         * @type {APIEmbed[]}
                         */
                        const embeds = data.generated_images.map(img => ({ image: { url: img.url } }))
                        console.log('[AI GENERATING] embeds :>> ', embeds);

                        message.edit({
                            content: `❓ __Generate AI image:__\n- Model: ${modelName}\n- Prompt:\n> *${prompt}*${negative_prompt ? `\n- Negative prompt:\n> *${negative_prompt}*` : ""}\n- Ratio: ${ratioStr}\n👉 **Dạ thưa đại ca <@${authorId}>, đây là hình em vừa vẽ:**`,
                            embeds
                        })
                    }

                    if (data.status === "FAILED") {
                        message.edit({
                            content: `❓ __Generate AI image:__\n- Model: ${modelName}\n- Prompt:\n> *${prompt}*${negative_prompt ? `\n- Negative prompt:\n> *${negative_prompt}*` : ""}\n- Ratio: ${ratioStr}\n❌ **Lỗi zồi... nô tài vô dụng quá <@${authorId}> ơi...**`,
                        })
                    }
                }
            });

            return message;
        } catch (error) {
            console.error(`[Leonardo.AI] error: `, error);
            return interaction.reply({ content: '❌ Unable to connect to Leonardo.AI: ' + error.message, ephemeral });
        }
    },
};
