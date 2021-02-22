const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
////const message.guild.me.displayColor = require('../../../../config/config.json').message.guild.me.displayColor

const emoji = require('../../../../config/emoji.json')

module.exports = {
    name: "snipe",
    category: "Moderation",
    description: "Finds a recently deleted message",
    usage: "\`PREFIXsnipe [number]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],

    execute: async function (client, message, args) {

        const snipe = new Discord.MessageEmbed()

        const snipes = client.snipes.get(message.channel.id) || []

        const msg = snipes[args[0] - 1 || 0]

        if (!msg) return message.channel.send(snipe.setColor('RED').setDescription(`**${emoji.downvote} There are no recently deleted messages!**`))

        const embed = new Discord.MessageEmbed()
            .setAuthor(`Deleted By: ${msg.author.tag}`, msg.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription(`**Deleted Message:** ${msg.content}`)
            .setColor(message.guild.me.displayColor)
            .setFooter(`Date: ${msg.date} | ${args[0] || 1}/${snipes.length}`)

        if (msg.image) embed.setImage(msg.image)

        message.channel.send(embed).catch((err) => {
            message.channel.send(snipe.setColor('RED').setDescription(`**${emoji.downvote} I was unable to fulfill your request**`))
        })
    }
}