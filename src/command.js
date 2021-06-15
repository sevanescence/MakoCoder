const Discord = require('discord.js');

class Command {
    /**
     * @param {string} label
     * @param {Function<Discord.Message, void>} onCommand
     */
    constructor(label, onCommand) {
        this.label = label;
        this.onCommand = onCommand;
    }
    /** @param {Discord.Message} message */
    onCommand(message) {}
}

module.exports = Command;
