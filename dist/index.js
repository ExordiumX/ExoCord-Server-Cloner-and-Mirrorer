"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const discord_1 = require("./modules/discord");
if (fs_1.default.existsSync('./map.json')) {
    discord_1.listen();
}
else {
    discord_1.getChannels().then((channels) => discord_1.createServer(channels)).then(() => discord_1.listen());
}
//# sourceMappingURL=index.js.map