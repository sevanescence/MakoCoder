const { Message } = require('discord.js');
const { ProgramMeta } = require('../langutils');
const fs = require('fs');
const { exit } = require('process');
const path = require('path');

const sessionMeta = {
    sessionsDir: '',
    /** @type {Map<string, Session>} */
    sessions: {},
};

class Session {
    /** @param {Message} message, @param {ProgramMeta} programMeta */
    constructor(message, programMeta) {
        this.id = `${message.author.id}-${message.guild.id}`;
        this.messageId = message.id;
        this.programMeta = programMeta;
    }
    static resolveFromJSON(sessionJSON) {
        // do this later lol
    }
    /** @return {Promise<string>} */
    async create() {
        const sessionDir = `${sessionMeta.sessionsDir}${path.sep}${this.id}`;
        await fs.mkdir(sessionDir);
        return sessionDir;
    }
}

module.exports = {
    sessionMeta,
    Session,
};
