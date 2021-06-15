const Discord = require('discord.js');
const env = require('dotenv');
const commandhandler = require('./commandhandler');
env.config();
const bot = new Discord.Client();
const commandHandler = require('./commandhandler');

bot.on('message', (message) => {
    const labelmatch = message.content.match(/.*?(?=\s|\n|\r\n|$)/);
    if (!labelmatch) return;
    const label = labelmatch[0];
    const command = commandHandler.commands.get(label);
    if (command) {
        command.onCommand(message);
    }
});

bot.once('ready', () => {
    commandHandler.initialize(bot);
    const runCommand = require('./commands/run');
    commandHandler.commands.set(runCommand.label, runCommand);
    console.log(`${bot.user.username} is online!`);
});

bot.login(process.env.BOT_TOKEN);
