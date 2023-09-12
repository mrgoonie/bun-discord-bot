import { ChatInputCommandInteraction, CommandInteraction, InteractionResponse, SlashCommandBuilder } from 'discord.js';

export default interface DiscordCommand {
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction | CommandInteraction) => Promise<InteractionResponse<boolean>>;
}
