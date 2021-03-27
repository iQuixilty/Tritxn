const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
require('../../../utils/extendedMessage')

/** 
 * @type {import('../../../typings.d').Command}
*/

module.exports = {
    name: "roles",
    category: "Misc",
    description: "Roles Command",
    usage: "\`PREFIXroles\`",
    someServersOnly: ['796125520961994764'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        if (message.guild.id !== '796125520961994764') return;

        message.channel.send(`<@&${"809958900484407344"}>\n<@&${"809958902577627146"}>\n<@&${"809958906620805140"}>\n<@&${"809958898547032096"}>\n<@&${"809958904229920839"}>\n<@&${"809959138825732156"}>`)


    }
}
