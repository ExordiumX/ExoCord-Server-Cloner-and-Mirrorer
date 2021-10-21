import * as dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN: discordToken, SERVER_ID: serverId } = process.env;

const headers = {
  'Content-Type': 'application/json',
  Authorization: discordToken!,
};

export {
  discordToken,
  serverId,
  headers,
};
