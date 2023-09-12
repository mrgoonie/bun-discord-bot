import { client } from 'modules/controller/AppController';
import { addList, getUserInDbBydiscordID } from 'mongoose/users';

export const getAllUsers = async () => {
    //
    const partialGuilds = await client.guilds.fetch();
    const guilds = await Promise.all(partialGuilds.map((partialGuild) => partialGuild.fetch()));

    const list = [...guilds[0].members.cache.values()]
        .map(({ nickname, user }) => {
            return { ...user, nickname };
        })
        .filter((x) => !x.bot);

    return list;
};

export const getAllAndSaveUsersToDB = async () => {
    //
    const list = await getAllUsers();

    await saveUsersToDBByList(list);
};

export const saveUsersToDBByList = async (list) => {
    //

    await addList(list);
    //
};

export const getUserByDiscordID = async (discordID) => {
    //

    const userDataDb = await getUserInDbBydiscordID(discordID);
    return userDataDb;
    // const list = await getAllUsers();

    // const found = list.find((x) => x.id == id);
    // return found;
    //
};
