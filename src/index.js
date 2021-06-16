const Discord = require('discord.js');
const commandhandler = require('./commandhandler');
const commandHandler = require('./commandhandler');
const { sessionMeta } = require('./session/sessionutils');

const fs = require('fs');
const env = require('dotenv');
const { exit } = require('process');

const bot = new Discord.Client();
env.config();

bot.on('message', (message) => {
    const labelmatch = message.content.match(/.*?(?=\s|\n|\r\n|$)/);
    if (!labelmatch) return;
    const label = labelmatch[0];
    const command = commandHandler.commands.get(label);
    command?.onCommand(message);
});

bot.once('ready', () => {
    sessionMeta.sessionsDir = process.env.SESSION_DIR;
    if (!sessionMeta.sessionsDir) {
        console.error('Error: SESSION_DIR was not defined in environment configuration.');
        exit(1);
    }
    if (!fs.existsSync(sessionMeta.sessionsDir)) {
        console.error(`Error: ${sessionMeta.sessionsDir} does not exist.`);
        exit(1);
    }

    commandHandler.initialize(bot);
    const runCommand = require('./commands/run');
    commandHandler.commands.set(runCommand.label, runCommand);
    console.log(`${bot.user.username} is online!`);
});

bot.login(process.env.BOT_TOKEN);
