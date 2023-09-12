import { REST, Routes } from 'discord.js';

export async function refreshAllGuildCommands(botToken: string, appID: string, guildID: string, commandsJSON: any) {
    const rest = new REST({ version: '10' }).setToken(botToken);

    const data = (await rest.put(Routes.applicationGuildCommands(appID, guildID), {
        body: commandsJSON,
    })) as any;

    // console.log("data :>> ", data);
    console.log(`[GUILD] Successfully reloaded ${data.length} application (/) commands.`);

    return data;
}
