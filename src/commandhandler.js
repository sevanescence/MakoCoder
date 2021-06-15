const Discord = require('discord.js');
const Command = require('./command');

class CommandHandler {
    /** @param {Discord.Client} clientContext */ // left here for intellisense
    constructor(clientContext) {
        this.clientContext = clientContext;
        /** @type {Map<String, Command>} */
        this.commands = new Map();
    }
    /** @param {Discord.Client} clientContext */
    initialize(clientContext) {
        this.clientContext = clientContext;
    }
}

module.exports = new CommandHandler();
