import {
    //
    SlashCommandBuilder,
} from 'discord.js';

import type DiscordCommand from '@/interfaces/discord-command';
import { askAi } from '@/utils/ask-ai';
import { aiModels } from '@/utils/ask-ai/ai-api';

// Test...
// askAi(`How to use discord.js`);

export default {
    // input
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Ask AI anything!')
        .addStringOption((option) => option.setName('question').setDescription('Ask your question').setRequired(true))
        .addStringOption((option) =>
            option
                .setName('model')
                .setDescription('Select the AI model')
                .addChoices(...aiModels.map((model, index) => ({ name: model, value: model, default: index === 0 })))
                .setRequired(false)
        ),
    async execute(interaction) {
        // const ephemeral = interaction.options.get('private')?.value || false;
        const ephemeral = false; // <-- always send "PUBLIC" to the channel

        const question = interaction.options.get('question')?.value?.toString();
        const model = interaction.options.get('model')?.value?.toString() || aiModels[0];
        const response = await interaction.reply({
            content: `❓ __Asked AI:__\n> *${question}*\n- Model: ${model}\n⏳ Please wait...`,
            ephemeral,
        });

        if (!question) return;

        try {
            // author
            const { user, member } = interaction;
            if (process.env.DEBUG) console.log('[ASK AI] interaction :>> ', interaction);
            if (process.env.DEBUG) console.log('[ASK AI] user :>> ', user);
            const authorId = user?.id;
            const username = user?.username || 'Anonymous';

            askAi(question, model, username)
                .then(async (result) => {
                    // catch error
                    if (result.error)
                        return response.edit({
                            content: `❓ __Asked AI:__ \n> *${question}*\n- Model: ${model}\n❌ Unable to connect to OpenRouter.AI: "${result.error}"`,
                        });

                    // edit reply
                    await response.edit({
                        content: `❓ __Asked AI:__ \n> *${question}*\n- Model: ${model}\n👉 **Dạ thưa đại ca <@${authorId}>:**`,
                    });

                    // send the messages of an answer:
                    const messages = result.content || [];
                    for (const msg of messages) {
                        await interaction.channel?.send({ content: msg });
                    }
                })
                .catch((error) => {
                    response.edit({
                        content: `❓ __Asked AI:__ \n> *${question}*\n- Model: ${model}\n❌ Unable to connect to OpenRouter.AI: "${error.message}"`,
                    });
                });
        } catch (error: any) {
            // console.error(`Ask AI error: `, error);
            response.edit({
                content: `❓ __Asked AI:__ \n> *${question}*\n- Model: ${model}\n❌ Unable to connect to OpenRouter.AI: "${error.message}"`,
            });
        }

        return response;
    },
} as DiscordCommand;
