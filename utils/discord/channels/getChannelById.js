import { client } from 'modules/controller/AppController';

export default function getChannelById(id) {
    //
    const channel = client.channels.cache.get(id);
    return channel;
}
