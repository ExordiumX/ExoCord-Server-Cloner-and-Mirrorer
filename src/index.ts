import fs from 'fs';
import { listen, createServer, getChannels } from './modules/discord';

if (fs.existsSync('./map.json')) {
  listen();
} else {
  getChannels().then((channels) => createServer(channels)).then(() => listen());
}
