const Discord = require('discord.js');
const fs = require('fs');
const child_process = require('child_process');

const languages = {};

class CommandHandler {
    /** @param {Discord.Message} message */
    static run(message) {
        // const argstr = message.content.match(/(?<=^\/run\s+?(?=[^\n]))[^`]*?(?=\n)/g)[0].replace(/(?<=\S)\s+?(?=\S)/g, ' ');
        // const args = argstr.split(' ');
        // console.log(args);
        // add args to read stderr instead of stdout or something lol

        const codematch = message.content.match(/(?<=```.+?\n)(.|\n|\r\n)+?(?=\n```)/g);
        const extmatch = message.content.match(/(?<=```).+?(?=\n)/g);
        if (!(codematch && extmatch)) {
            message.channel.send('Error: Code not provided, or you greatly messed up the formatting. Lol.');
            return;
        }
        const code = codematch[0];
        const ext = extmatch[0];

        const filename = `./${message.author.id}-${message.channel.id}`;

        fs.writeFile(`./${filename}.${ext}`, code, { encoding: 'utf-8' }, () => {
            child_process.exec(`g++ -o ${filename} ./${filename}.${ext}`);
            message.channel.send({
                embed: {
                    description: `\`\`\`${child_process.execFileSync(`${filename}.exe`)}\`\`\``,
                },
            });
        });
    }
}

module.exports = CommandHandler;
