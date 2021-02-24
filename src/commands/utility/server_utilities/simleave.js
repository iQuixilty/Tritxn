const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "simleave",
    category: "Utility",
    description: "Simulates a user leaving the server",
    usage: "\`PREFIXsimleave\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {

        client.emit('guildMemberRemove', message.member)

    }
}
