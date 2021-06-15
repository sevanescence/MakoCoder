const Discord = require('discord.js');
const Command = require('../command');
const { ProgramMeta, languages } = require('../langutils');

/** @param {string} content @return {string[]} */
const getCodeBlocks = (content) => {
    let arr = [];
    content = content.replace(/```(.|\n|\r\n)+?```/g, (match) => {
        arr.push(match);
        return '';
    });
    return arr;
};

// i hate this language.
const run = new Command(
    '/run',
    /** @param {Discord.Message} message */ (message) => {
        const blocks = getCodeBlocks(message.content);
        if (blocks.length < 1) {
            message.channel.send({
                embed: {
                    description: 'this is meant to be a helpful embed.',
                },
            });
            return;
        }

        const programMeta = ProgramMeta.resolve(message.content);
        if (languages[programMeta.language]) {
        } else {
            message.channel.send({
                embed: {
                    title: 'Error',
                    description: `${programMeta.language} is not a supported language!`,
                },
            });
        }
        // const code = blocks.shift();
        // console.log(getCodeBlockStripped(code));
    }
);

module.exports = run;
