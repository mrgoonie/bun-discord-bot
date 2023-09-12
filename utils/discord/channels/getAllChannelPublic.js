import { IsLocal } from 'app.config';
import { toInt } from 'diginext-utils/dist/object';
import { Collection } from 'discord.js';
import { client } from 'modules/controller/AppController';

export default function getAllChannelPublic(params) {
    //
    const channels = new Collection();

    const privateChannel = [
        'dev-jokes',
        'everyday-devtools',
        'tech-news',
        'technical',
        '🤣-relax',
        'backend-team',
        'frontend-team',
        'design-team',
        'research-and-development',
        'strategy-marketing',
        'vi-déo-team',
        'accounts',
    ];

    const ignoreChannel = [
        'nhà-top',
        'thông-báo',
        'top-chia-sẻ-tuần',
        'meeting-room',
        'change-color',
        'image',
        'updates',
        'pick-a-role',
    ];

    if (IsLocal()) {
        privateChannel.push('test-bot-unique');
        privateChannel.push('test-forum');
    }

    const list = [...client.channels.cache.values()]
        .map(({ type, name, guild, threads, messages, permissionOverwrites, ...rest }) => {
            return {
                type,
                name,
                permissionOverwrites,
                ...rest,
            };
        })
        .filter((x) => x)
        .filter(
            ({ permissionOverwrites, name, type }) =>
                (permissionOverwrites?.channel?.permissionOverwrites.cache.hasAny('1054723085217054791') ||
                    privateChannel.includes(name)) &&
                !ignoreChannel.includes(name) &&
                toInt(type) != 4
        )
        .forEach(({ id, type, name, nsfw }) => {
            // console.log('name :>> ', name, type);
            channels.set(id, { id, type, name, nsfw });
        });

    return channels;
}
