const { Message } = require('discord.js');
const { ProgramMeta } = require('../langutils');

const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const sessionMeta = {
    sessionsDir: '',
    /** @type {Map<string, Session>} */
    sessions: {},
};

const SESSION_DURATION_MILLIS = 10 * 60 * 1000; // ten minutes

class Session {
    /** @param {Message} message, @param {ProgramMeta} programMeta */
    constructor(message, programMeta) {
        this.id = `${message.author.id}-${message.guild.id}`;
        this.messageId = message.id;
        this.programMeta = programMeta;
        this.expires = Date.now() + SESSION_DURATION_MILLIS;
    }
    static resolveFromJSON(sessionJSON) {
        // do this later lol
    }
    /** @return {Promise<string>} */
    async create() {
        const sessionDir = `${sessionMeta.sessionsDir}${path.sep}${this.id}`;
        try {
            const a = fs.mkdirSync(sessionDir);
            // yet another reason to hate javascript. definitely refactoring to typescript in production
        } catch (/** @type {NodeJS.ErrnoException} */ err) {
            if (err.code === 'EEXIST') {
                // clear directory
                const files = fs.readdirSync(sessionDir, { withFileTypes: true });
                files.forEach((dirent) => {
                    const filedir = `${sessionDir}${path.sep}${dirent.name}`;
                    fs.unlinkSync(filedir);
                });
            } else {
                console.error(`FATAL ERROR: Directory ${sessionDir} could not be created.`);
                console.error(err);
                console.error('Exiting.');
                exit(1);
            }
        }
        return sessionDir;
    }
}

module.exports = {
    sessionMeta,
    Session,
};
