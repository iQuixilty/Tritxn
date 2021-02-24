const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "simjoin",
    category: "Utility",
    description: "Simulates a user joining the server",
    usage: "\`PREFIXsimjoin\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    execute: async function (client, message, args) {

        client.emit('guildMemberAdd', message.member)

    }
}
