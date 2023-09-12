// import discord.js
import fs from 'node:fs';
import path from 'node:path';

import { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import DiscordCommand from './interfaces/discord-command';

// create a new Client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

const commands = new Collection<string, DiscordCommand>();
const commandsJSON = [];

// listen for the client to be ready
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    {
        const commandsDir = path.resolve('./commands');
        const commandFiles = fs.readdirSync(commandsDir).filter((file) => file.endsWith('.ts'));

        Promise.all(
            commandFiles.map(async (file) => {
                const filePath = path.join(commandsDir, file);
                const commandImport = await import(filePath);
                const command = commandImport.default;
                commands.set(command.data.name, command);
                commandsJSON.push(command.data.toJSON());
            })
        );
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    // console.log('interaction :>> ', interaction);
    console.log('interaction.commandName :>> ', interaction.commandName);
    // console.log("interaction.data :>> ", interaction.data);
    // console.log("interaction.customId", interaction.customId);

    const command = commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `❌ Unable to execute this command: ${error}`, ephemeral: true });
        }
    }
});

// login with the token from .env.local
client.login(process.env.DISCORD_TOKEN);
