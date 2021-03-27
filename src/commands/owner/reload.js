const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const glob = require('glob')

const fs = require('fs')
/** 
 * @type {import('../../typings.d').Command}
*/

module.exports = {
    name: "reload",
    category: "Utility",
    description: "Only for bot owner",
    usage: "\`PREFIXreload [command]\`",
    hideCommand: true,
    devOnly: true,
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        client.commands.sweep(() => true)
        glob(`${__dirname}/../**/*.js`, async (err, filePaths) => {
            if (err) return console.log(err);
            filePaths.forEach((file) => {
                delete require.cache[require.resolve(file)];

                const pull = require(file);

                if (pull.name) {
                    client.commands.set(pull.name, pull)
                }

                if (pull.aliases && Array.isArray(pull.aliases)) {
                    pull.aliases.forEach((alias) => {
                        client.commands.set(alias, pull)
                    })
                }
            })
            message.channel.send(new Discord.MessageEmbed().setColor(message.guild.me.displayColor).setDescription(`**Reloaded Commands**`))
        })
    }
}
