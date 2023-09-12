import { client } from 'modules/controller/AppController';

export default function getChannelByName(channelName) {
    //
    const found = [...client.channels.cache.values()].find(({ name }) => name == channelName);

    if (found) {
        const channel = client.channels.cache.get(found.id);
        return channel;
    }

    return null;
}
