const Discord = require('discord.js');
const env = require('dotenv');
env.config();
const bot = new Discord.Client();
const CommandHandler = require('./commandhandler');

bot.on('message', (message) => {
    if (message.content.match(/^\/run.*?\n/)) {
        CommandHandler.run(message);
    }
});

bot.once('ready', () => {
    console.log(`${bot.user.username} is online!`);
});

bot.login(process.env.BOT_TOKEN);
