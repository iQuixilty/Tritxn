const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "esnipe",
    category: "Moderation",
    description: "Finds a recently edited message",
    usage: "\`PREFIXesnipe [number]\`",
    someServers: ['796125520961994764'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {

        const esnipe = new Discord.MessageEmbed()

        const esnipes = client.esnipes.get(message.channel.id) || []

        const msg = esnipes[args[0] - 1 || 0]

        if (!msg) return message.channel.send(esnipe.setColor('RED').setDescription(`**${emoji.downvote} There are no recently edited messages!**`))

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Edited By: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`**Original Message:** ${msg.content}`)
            .setColor(message.guild.me.displayColor)
            .setFooter(`Date: ${msg.date} | ${args[0] || 1}/${esnipes.length}`)

        message.channel.send(embed).catch((err) => {
            message.channel.send(esnipe.setColor('RED').setDescription(`**${emoji.downvote} I was unable to fulfill your request**`))
        })
    }
}