const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const fs = require('fs')
const sourcebin = require('sourcebin');

/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "file",
    category: "Utility",
    description: "Only for bot owner",
    usage: "\`PREFIXfile [path]\`",
    hideCommand: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        if (message.author.id !== '751606134938402866') return;

        const x = `\`\`\``

        let title = ''

        if (!args[0]) return;

        fs.readFile(`${args[0]}`, 'utf8', async (err, data) => {

            if (args[0].includes(`\\`)) {
                let msg = args[0].split(`\\`)
                title = msg[msg.length - 1]
            } else {
                title = args[0]
            }

            if (err) {
                return message.reply('Something went wrong')
            }
            if (data.length > 2000) {
                const bin = await sourcebin.create(
                    [
                        {
                            content: data,
                            language: 'JavaScript',
                        },
                    ],
                    {
                        title: title,
                        description: `Code for ${title}`,
                    },
                ).catch((e) => {
                    return message.reply('Something went wrong')
                })

                message.channel.send(new Discord.MessageEmbed()
                    .setDescription(`[${bin.title}](${bin.url})`)
                    .setColor(message.guild.me.displayColor))
            } else {
                message.channel.send(x + `js` + `\n${data}` + x)
            }
        })
    }
}
