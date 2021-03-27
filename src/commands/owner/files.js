const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')

const fs = require('fs')


/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "files",
    category: "Utility",
    description: "Only for bot owner",
    usage: "\`PREFIXfiles [path]\`",
    hideCommand: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        if (message.author.id !== '751606134938402866') return;

        let directory = args[0]
        if (!args[0]) return;

        let files = fs.readdirSync(directory)

        let reply = ``

        for (let i = 0; i < files.length; i++) {
            reply += `${i + 1}. ${files[i]}\n`
        }

        message.channel.send(new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setDescription(reply))
    }
}
