const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "pp",
    category: "Misc",
    aliases: ["peepee"],
    description: "Measures your pp lmao",
    usage: "\`PREFIXpp [user]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        // Var Setups
        var user = message.mentions.members.first() || message.author

        // PP size
        let pp = Math.floor(Math.random() * 15) + 0

        // Send message
        const embed = new Discord.MessageEmbed()
            .setTitle('How big is it?')
            .setColor(message.guild.me.displayColor)
            .setDescription(`${user}'s pp be like:\n\n8${'='.repeat(pp)}D`)
            .setTimestamp()
        return message.channel.send(embed)
    }
}