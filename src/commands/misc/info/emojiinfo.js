const PREFIX = require('../../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const { setCooldown } = require('../../../utils/utils')

module.exports = {
    name: "emojiinfo",
    category: "Misc",
    aliases: ["ei"],
    description: "Displays info about an emoji",
    usage: "\`PREFIXemojiinfo [emoji]\`",
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        const ei = new Discord.MessageEmbed()

        if (!args[0]) return message.channel.send(ei.setColor(message.guild.me.displayColor).setDescription('**Give an emoji name or id**'))


        let emoji = message.guild.emojis.cache.find(emoji => emoji.name === args[0] || emoji.id === args[0] || emoji == args[0].replace(/([^\d])+/gim, ''));

        if (!emoji) return message.reply(ei.setColor(message.guild.me.displayColor).setDescription('**Invalid emoji**'))
        setCooldown(client, this, message)
        let a = null

        let x = "`"

        let galaxy;
        let link;

        let name = emoji.name

        let id = emoji.id

        let link1 = `https://cdn.discordapp.com/emojis/${id}`

        if (emoji.animated === true) {
            galaxy = `<a:${name}:${emoji.id}>`
            link = link1 + ".gif"
        } else {
            galaxy = `<:${name}:${emoji.id}>`
            link = link1 + ".png"
        }

        let mention = galaxy

        const b = new Discord.MessageEmbed()
            .setTitle(`Emoji info!`)
            .setThumbnail(link)
            .addFields(

                { name: "Emoji:", value: emoji, inline: false },
                { name: "Mention:", value: x + mention + x, inline: false },
                { name: "Name:", value: x + name + x, inline: true },
                { name: "Id:", value: x + id + x, inline: true },
                { name: "Animated:", value: emoji.animated ? "Animated" : "Not Animated", inline: false }
            )

        //adding fields


        b.setURL(link)
        b.setColor('RANDOM')
        message.channel.send(b)
    }
}