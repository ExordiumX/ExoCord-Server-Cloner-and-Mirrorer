"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.getChannels = exports.listen = exports.createChannel = exports.executeWebhook = exports.createWebhook = void 0;
const ws_1 = __importDefault(require("ws"));
const jsonfile_1 = __importDefault(require("jsonfile"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const env_1 = require("../util/env");
const createWebhook = async (channelId) => node_fetch_1.default(`https://discord.com/api/v8/channels/${channelId}/webhooks`, {
    method: 'POST',
    headers: env_1.headers,
    body: JSON.stringify({
        name: channelId,
    }),
}).then((res) => res.json())
    .then((json) => `https://discord.com/api/v8/webhooks/${json.id}/${json.token}`);
exports.createWebhook = createWebhook;
const executeWebhook = async ({ content, embeds, username, url, avatar, }) => node_fetch_1.default(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        content,
        embeds,
        username,
        avatar_url: avatar,
    }),
});
exports.executeWebhook = executeWebhook;
const createChannel = async (name, pos, newId, parentId) => node_fetch_1.default(`https://discord.com/api/v8/guilds/${newId}/channels`, {
    method: 'POST',
    headers: env_1.headers,
    body: JSON.stringify({
        name,
        parent_id: parentId,
        position: pos,
    }),
}).then((res) => res.json());
exports.createChannel = createChannel;
const listen = async () => {
    const serverMap = jsonfile_1.default.readFileSync('./map.json');
    const socket = new ws_1.default('wss://gateway.discord.gg/?v=6&encoding=json');
    let authenticated = false;
    socket.on('open', () => {
        console.log('Connected to Discord API');
    });
    socket.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        switch (message.op) {
            case 10:
                socket.send(JSON.stringify({
                    op: 1,
                    d: message.s,
                }));
                setInterval(() => {
                    socket.send(JSON.stringify({
                        op: 1,
                        d: message.s,
                    }));
                }, message.d.heartbeat_interval);
                break;
            case 11:
                if (!authenticated) {
                    socket.send(JSON.stringify({
                        op: 2,
                        d: {
                            token: env_1.discordToken,
                            properties: {
                                $os: 'linux',
                                $browser: 'test',
                                $device: 'test',
                            },
                        },
                    }));
                    authenticated = true;
                }
                break;
            case 0:
                if (message.t === 'MESSAGE_CREATE' && message.d.guild_id === env_1.serverId) {
                    const { content, embeds, channel_id: channelId } = message.d;
                    const { avatar, username, id, discriminator, } = message.d.author;
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
                    const webhookUrl = serverMap[channelId];
                    const hookContent = {
                        content,
                        embeds,
                        username: `${username}#${discriminator}`,
                        url: webhookUrl,
                        avatar: avatarUrl,
                    };
                    exports.executeWebhook(hookContent);
                }
                break;
            default:
                break;
        }
    });
};
exports.listen = listen;
const getChannels = async () => node_fetch_1.default(`https://discord.com/api/v8/guilds/${env_1.serverId}/channels`, {
    method: 'GET',
    headers: env_1.headers,
}).then((res) => res.json())
    .then((json) => json);
exports.getChannels = getChannels;
const createServer = async (channels) => {
    console.log('Creating mirror server...');
    const cleanedChannels = channels.map(({ id, parent_id, guild_id, last_message_id, ...rest }) => rest);
    const categories = cleanedChannels.filter((channel) => channel.type === 4);
    const body = {
        name: 'mirror',
        channels: categories,
    };
    const serverMap = new Map();
    const serverResp = await node_fetch_1.default('https://discord.com/api/v8/guilds', {
        method: 'POST',
        headers: env_1.headers,
        body: JSON.stringify(body),
    });
    const server = await serverResp.json();
    const newId = server.id;
    serverMap.set('serverId', newId);
    const channelResp = await node_fetch_1.default(`https://discord.com/api/v8/guilds/${newId}/channels`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: env_1.discordToken,
        },
    });
    const serverChannels = await channelResp.json();
    return new Promise(async (resolve) => {
        for (const channel of channels) {
            if (channel.parent_id && channel.type !== 2) {
                const parentChannel = channels.find((chan) => chan.id === channel.parent_id);
                if (parentChannel) {
                    const newParentChannel = serverChannels.find((chan) => chan.name === parentChannel.name);
                    if (newParentChannel) {
                        const newChannel = await exports.createChannel(channel.name, channel.position, newId, newParentChannel.id);
                        const newWebhook = await exports.createWebhook(newChannel.id);
                        serverMap.set(channel.id, newWebhook);
                    }
                }
            }
        }
        jsonfile_1.default.writeFileSync('./map.json', Object.fromEntries(serverMap));
        resolve();
    });
};
exports.createServer = createServer;
//# sourceMappingURL=discord.js.map