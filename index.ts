// import discord.js
import fs from 'node:fs';
import path from 'node:path';

import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

import type DiscordCommand from './interfaces/discord-command';
import { refreshAllGuildCommands } from './utils/discord/guilds/refresh-commands';
// import { refreshAllGuildCommands } from './utils/discord/guilds/refresh-commands';

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
const commandsJSON: any[] = [];

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
        )
            .then(async () => {
                // The put method is used to fully refresh all commands in the guild with the current set
                const botToken = process.env.DISCORD_TOKEN;
                const appID = process.env.DISCORD_APP_ID;
                const guildID = process.env.DISCORD_GUILD_ID;

                if (appID && botToken && guildID) refreshAllGuildCommands(botToken, appID, guildID, commandsJSON);
            })
            .catch((e) => console.log('e :>> ', e));
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
