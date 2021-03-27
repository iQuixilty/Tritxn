const PREFIX = require('../../../config/config.json').PREFIX;
const Discord = require('discord.js')
const Levels = require('discord-xp')
const { setCooldown } = require('../../utils/utils')

/**
 * @type {import('../../typings.d').Command}
 */

module.exports = {
    name: "givelevel",
    category: "Levels",
    aliases: ["addlevel", "gl", "al"],
    description: "Adds the level to the specified user",
    usage: "\`PREFIXaddlevel [user] [level]\`",
    perms: ['MANAGE_GUILD'],
    clientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],

    execute: async function (client, message, args) {
        setCooldown(client, this, message)
        const embed = new Discord.MessageEmbed()

        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0])

        if (!target) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**Provide who's level to change**`))

        let newLevel = args[1]

        if (!newLevel || isNaN(newLevel)) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**Provide a valid amount of level(s) that you want to add to that user**`))

        if (newLevel > 300 || newLevel < 1) return message.channel.send(embed.setColor(message.guild.me.displayColor)
            .setDescription(`**The max amount of levels you can add is 300**`))

        const user = await Levels.appendLevel(target.id, message.guild.id, newLevel)

        message.channel.send(embed
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Successfully added \`${newLevel}\` level(s) to ${target}'s`)
            .setFooter(`They are now level ${user.level}`)
            .setColor(message.guild.me.displayColor))





    }
}