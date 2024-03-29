const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const {setCooldown} = require('../../../utils/utils')
/** 
 * @type {import('../../../typings.d').Command}
*/


module.exports = {
    name: "google",
    category: "Misc",
    aliases: ["goog"],
    description: "Google something!",
    usage: "\`PREFIXgoogle [query]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const query = encodeURIComponent(args.join("+"));

        message.channel.send(
            new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setTitle("Google Search")
            .setDescription(`**Go to:** \n[https://www.google.com/search?=${query}/](https://www.youtube.com/watch?v=oHg5SJYRHA0)`));
    }
}