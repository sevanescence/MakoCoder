const Discord = require('discord.js');
const fs = require('fs');
const child_process = require('child_process');

const languages = {};

// hardcoded since run is the only command

// todo add compiler args option
// todo incompatible library error tracing (i.e. winsock on linux)

// todo: refactor into parseutils.js
/** @param {string} content */
const getCodeBlocks = (content) => {
    /** @type {Array<string>} */
    let arr = [];
    while (content.match(/```(.|\n|\r\n)+?```/)) {
        content = content.replace(/```(.|\n|\r\n)+?```/, (match) => {
            arr.push(match);
            return '';
        });
    }
    return arr;
};

class CommandHandler {
    /** @param {Discord.Message} message */
    static run(message) {
        // const argstr = message.content.match(/(?<=^\/run\s+?(?=[^\n]))[^`]*?(?=\n)/g)[0].replace(/(?<=\S)\s+?(?=\S)/g, ' ');
        // const args = argstr.split(' ');
        // console.log(args);
        // add args to read stderr instead of stdout or something lol

        const blocks = getCodeBlocks(message.content);
        if (blocks.length < 1) {
            message.channel.send({
                embed: {},
            });
            return;
        }
        // const codematch = message.content.match(/(?<=```(.+?\n|))(.|\n|\r\n)+?(?=\n```)/g);
        // const extmatch = message.content.match(/(?<=```).+?(?=\n)/g);
        // if (!(codematch && extmatch)) {
        //     // todo build helpful embed
        //     message.channel.send('Error: Code not provided, or you greatly messed up the formatting. Lol.');
        //     return;
        // }
        // const code = codematch[0];
        // const ext = extmatch[0];
        // console.log(codematch);
        // if (codematch.length > 1) console.log(codematch[1]);
        return;

        const filename = `./${message.author.id}-${message.channel.id}`;

        fs.writeFileSync(`./${filename}.${ext}`, code, { encoding: 'utf-8' });
        child_process.execSync(`g++ -o ${filename} ${filename}.${ext}`);
        message.channel.send({
            embed: {
                description: `\`\`\`${child_process.execFileSync(`${filename}.exe`)}\`\`\``,
            },
        });
    }
}

module.exports = CommandHandler;
