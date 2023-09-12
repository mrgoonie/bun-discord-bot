import type { ChatInputCommandInteraction } from 'discord.js';
import {
    //
    SlashCommandBuilder,
} from 'discord.js';

import type DiscordCommand from '@/interfaces/discord-command';

export default {
    data: new SlashCommandBuilder().setName('test2').setDescription('test!'),
    // .addStringOption((option) => option.setName('title').setDescription('Tiêu đề').setRequired(true))
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            return await interaction.reply(`Hello!`);
        } catch (error) {
            console.error(`test error`, error);
        }

        return interaction.reply('0');
    },
} as DiscordCommand;
