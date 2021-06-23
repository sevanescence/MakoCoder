const Discord = require('discord.js');
const Command = require('../command');
const langutils = require('../lang/langutils');
const { ProgramMeta, languages } = require('../lang/langutils');
const { Session, sessionMeta } = require('../session/sessionutils');

const fs = require('fs');
const path = require('path');

/** @param {string} content @return {string[]} */
const getCodeBlocks = (content) => {
    let arr = [];
    content = content.replace(/```[A-Za-z0-9-._,]+?\n(.|\n|\r\n)+?```/g, (match) => {
        arr.push(match);
        return '';
    });
    return arr;
};

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
        try {
            const lang = languages.getLanguage(programMeta.language);
            // create session
            // compile
            // todo: option to read compiler stdout
            // if compiler error, send error
            // otherwise, send stdout
            // another todo: compiler args
            // /run c_args="-DUNICODE --static-libc++ std=c++14" cmd_args="--compiler --no-run"
            const session = new Session(message, programMeta);
            const sessionContext = session
                .create()
                .then((dir) => {
                    // build files
                    const programFilepath = `${dir}${path.sep}a.${programMeta.language}`;
                    fs.writeFileSync(programFilepath, programMeta.code, { encoding: 'utf-8' });
                    programMeta.blocks.forEach((block) => {
                        const blockFilepath = `${dir}${path.sep}${block.header}`;
                        // console.log(blockFilepath);
                        fs.writeFileSync(blockFilepath, block.content, { encoding: 'utf-8' });
                    });
                    return dir;
                })
                .catch((err) => console.error(err));
            sessionContext.then((dir) => {
                langutils.compile(dir, lang).then((buf) => {
                    console.log(buf.toString());
                    langutils.run(dir, lang).then((buf) => {
                        message.channel.send(`\`\`\`\n${buf.toString()}\n\`\`\``);
                    });
                });
            });
        } catch (e) {
            message.channel.send({
                embed: {
                    title: 'Error',
                    description: `${programMeta.language} is not a supported language!`,
                },
            });
        }
    }
);

module.exports = run;
